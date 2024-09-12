/**
 *  The JSON Wallet formats allow a simple way to store the private
 *  keys needed in Ethereum along with related information and allows
 *  for extensible forms of encryption.
 */

import aesjs from "aes-js";
import { keccak_256 } from "@noble/hashes/sha3";
import { scrypt as _nobleSync, scryptAsync as _nobleAsync } from "@noble/hashes/scrypt";
import { randomBytesBrowser } from "./randombytes";


const defaultPath = "m/44'/60'/0'/0/0";

/**
 *  The contents of a JSON Keystore Wallet.
 */
type KeystoreAccount = {
    address: string;
    privateKey: string;
    mnemonic?: {
        path?: string;
        locale?: string;
        entropy: string;
    }
};

/**
 *  The parameters to use when encrypting a JSON Keystore Wallet.
 */
type EncryptOptions = {
   iv?: BytesLike;
   entropy?: BytesLike;
   client?: string;
   salt?: BytesLike;
   uuid?: string;
   scrypt?: {
       N?: number;
       r?: number;
       p?: number;
   }
}



type ScryptParams = {
    name: "scrypt";
    salt: Uint8Array;
    N: number;
    r: number;
    p: number;
    dkLen: number;
};




function getEncryptKdfParams(options: EncryptOptions): ScryptParams {
    // Check/generate the salt
    const salt = (options.salt != null) ? getBytes(options.salt, "options.salt"): randomBytes(32);

    // Override the scrypt password-based key derivation function parameters
    let N = (1 << 17), r = 8, p = 1;
    if (options.scrypt) {
        if (options.scrypt.N) { N = options.scrypt.N; }
        if (options.scrypt.r) { r = options.scrypt.r; }
        if (options.scrypt.p) { p = options.scrypt.p; }
    }
    assertArgument(typeof(N) === "number" && N > 0 && Number.isSafeInteger(N) && (BigInt(N) & BigInt(N - 1)) === BigInt(0), "invalid scrypt N parameter", "options.N", N);
    assertArgument(typeof(r) === "number" && r > 0 && Number.isSafeInteger(r), "invalid scrypt r parameter", "options.r", r);
    assertArgument(typeof(p) === "number" && p > 0 && Number.isSafeInteger(p), "invalid scrypt p parameter", "options.p", p);

    return { name: "scrypt", dkLen: 32, salt, N, r, p };
}
const HexCharacters: string = "0123456789abcdef";

function hexlify(data: BytesLike): string {
    const bytes = getBytes(data);

    let result = "0x";
    for (let i = 0; i < bytes.length; i++) {
        const v = bytes[i];
        result += HexCharacters[(v & 0xf0) >> 4] + HexCharacters[v & 0x0f];
    }
    return result;
}

function uuidV4(randomBytes: BytesLike): string {
    const bytes = getBytes(randomBytes, "randomBytes");

    // Section: 4.1.3:
    // - time_hi_and_version[12:16] = 0b0100
    bytes[6] = (bytes[6] & 0x0f) | 0x40;

    // Section 4.4
    // - clock_seq_hi_and_reserved[6] = 0b0
    // - clock_seq_hi_and_reserved[7] = 0b1
    bytes[8] = (bytes[8] & 0x3f) | 0x80;

    const value = hexlify(bytes);

    return [
       value.substring(2, 10),
       value.substring(10, 14),
       value.substring(14, 18),
       value.substring(18, 22),
       value.substring(22, 34),
    ].join("-");
}

function concat(datas: ReadonlyArray<BytesLike>): string {
    return "0x" + datas.map((d) => hexlify(d).substring(2)).join("");
}
function zpad(value: String | number, length: number): String {
    value = String(value);
    while (value.length < length) { value = '0' + value; }
    return value;
}


function randomBytes(length: number): Uint8Array {
    return new Uint8Array(randomBytesBrowser(length));
}

const _keccak256 = function(data: Uint8Array): Uint8Array {
    return keccak_256(data);
}

let __keccak256: (data: Uint8Array) => BytesLike = _keccak256;


function keccak256(_data: BytesLike): string {
    const data = getBytes(_data, "data");
    return hexlify(__keccak256(data));
}

function _encryptKeystore(key: Uint8Array, kdf: ScryptParams, account: KeystoreAccount, options: EncryptOptions): any {

    const privateKey = getBytes(account.privateKey, "privateKey");

    // Override initialization vector
    const iv = (options.iv != null) ? getBytes(options.iv, "options.iv"): randomBytes(16);
    assertArgument(iv.length === 16, "invalid options.iv length", "options.iv", options.iv);

    // Override the uuid
    const uuidRandom = (options.uuid != null) ? getBytes(options.uuid, "options.uuid"): randomBytes(16);
    assertArgument(uuidRandom.length === 16, "invalid options.uuid length", "options.uuid", options.iv);

    // This will be used to encrypt the wallet (as per Web3 secret storage)
    // - 32 bytes   As normal for the Web3 secret storage (derivedKey, macPrefix)
    // - 32 bytes   AES key to encrypt mnemonic with
    const derivedKey = key.slice(0, 16);
    const macPrefix = key.slice(16, 32);

    // Encrypt the private key
    const aesCtr = new  aesjs.ModeOfOperation.ctr(derivedKey, new aesjs.Counter(iv));
    const ciphertext = getBytes(aesCtr.encrypt(privateKey));

    // Compute the message authentication code, used to check the password
    const mac = keccak256(concat([ macPrefix, ciphertext ]))

    // See: https://github.com/ethereum/wiki/wiki/Web3-Secret-Storage-Definition
    const data: { [key: string]: any } = {
        address: account.address.substring(2).toLowerCase(),
        id: uuidV4(uuidRandom),
        version: 3,
        Crypto: {
            cipher: "aes-128-ctr",
            cipherparams: {
                iv: hexlify(iv).substring(2),
            },
            ciphertext: hexlify(ciphertext).substring(2),
            kdf: "scrypt",
            kdfparams: {
                salt: hexlify(kdf.salt).substring(2),
                n: kdf.N,
                dklen: 32,
                p: kdf.p,
                r: kdf.r
            },
            mac: mac.substring(2)
        }
    };

    // If we have a mnemonic, encrypt it into the JSON wallet
    if (account.mnemonic) {
        const client = (options.client != null) ? options.client: `morpherWallet`;

        const path = account.mnemonic.path || defaultPath;
        const locale = account.mnemonic.locale || "en";

        const mnemonicKey = key.slice(32, 64);

        const entropy = getBytes(account.mnemonic.entropy, "account.mnemonic.entropy");
        const mnemonicIv = randomBytes(16);
        const mnemonicAesCtr = new aesjs.ModeOfOperation.ctr(mnemonicKey, new aesjs.Counter(mnemonicIv));
        const mnemonicCiphertext = getBytes(mnemonicAesCtr.encrypt(entropy));

        const now = new Date();
        const timestamp = (now.getUTCFullYear() + "-" +
                           zpad(now.getUTCMonth() + 1, 2) + "-" +
                           zpad(now.getUTCDate(), 2) + "T" +
                           zpad(now.getUTCHours(), 2) + "-" +
                           zpad(now.getUTCMinutes(), 2) + "-" +
                           zpad(now.getUTCSeconds(), 2) + ".0Z");
        const gethFilename = ("UTC--" + timestamp + "--" + data.address);

        data["x-ethers"] = {
            client, gethFilename, path, locale,
            mnemonicCounter: hexlify(mnemonicIv).substring(2),
            mnemonicCiphertext: hexlify(mnemonicCiphertext).substring(2),
            version: "0.1"
        };
    }

    return JSON.stringify(data);
}
type DataHexString = string;

type BytesLike = DataHexString | Uint8Array;

function stringify(value: any): any {
    if (value == null) { return "null"; }

    if (Array.isArray(value)) {
        return "[ " + (value.map(stringify)).join(", ") + " ]";
    }

    if (value instanceof Uint8Array) {
        const HEX = "0123456789abcdef";
        let result = "0x";
        for (let i = 0; i < value.length; i++) {
            result += HEX[value[i] >> 4];
            result += HEX[value[i] & 0xf];
        }
        return result;
    }

    if (typeof(value) === "object" && typeof(value.toJSON) === "function") {
        return stringify(value.toJSON());
    }

    switch (typeof(value)) {
        case "boolean": case "symbol":
            return value.toString();
        case "bigint":
            return BigInt(value).toString();
        case "number":
            return (value).toString();
        case "string":
            return JSON.stringify(value);
        case "object": {
            const keys = Object.keys(value);
            keys.sort();
            return "{ " + keys.map((k) => `${ stringify(k) }: ${ stringify(value[k]) }`).join(", ") + " }";
        }
    }

    return `[ COULD NOT SERIALIZE ]`;
}


function makeError<K , T >(message: string, code: K, info?: any): T {
    let shortMessage = message;

    {
        const details: Array<string> = [];
        if (info) {
            if ("message" in info || "code" in info || "name" in info) {
                throw new Error(`value will overwrite populated values: ${ stringify(info) }`);
            }
            for (const key in info) {
                if (key === "shortMessage") { continue; }
                const value = <any>(info[<keyof any>key]);
//                try {
                    details.push(key + "=" + stringify(value));
//                } catch (error: any) {
//                console.log("MMM", error.message);
//                    details.push(key + "=[could not serialize object]");
//                }
            }
        }
        details.push(`code=${ code }`);

        if (details.length) {
            message += " (" + details.join(", ") + ")";
        }
    }

    let error;
    switch (code) {
        case "INVALID_ARGUMENT":
            error = new TypeError(message);
            break;
        case "NUMERIC_FAULT":
        case "BUFFER_OVERRUN":
            error = new RangeError(message);
            break;
        default:
            error = new Error(message);
    }


    if (info) { Object.assign(error, info); }


    return <T>error;
}


function assert<K, T>(check: unknown, message: string, code: K, info?: any): asserts check {
    if (!check) { throw makeError(message, code, info); }
}

function assertArgument(check: unknown, message: string, name: string, value: unknown): asserts check {
    assert(check, message, "INVALID_ARGUMENT", { argument: name, value: value });
}

function _getBytes(value: BytesLike, name?: string, copy?: boolean): Uint8Array {
    if (value instanceof Uint8Array) {
        if (copy) { return new Uint8Array(value); }
        return value;
    }

    if (typeof(value) === "string" && value.match(/^0x(?:[0-9a-f][0-9a-f])*$/i)) {
        const result = new Uint8Array((value.length - 2) / 2);
        let offset = 2;
        for (let i = 0; i < result.length; i++) {
            result[i] = parseInt(value.substring(offset, offset + 2), 16);
            offset += 2;
        }
        return result;
    }

    assertArgument(false, "invalid BytesLike value", name || "value", value);
}
function getBytesCopy(value: BytesLike, name?: string): Uint8Array {
    return _getBytes(value, name, true);
}
function getBytes(value: BytesLike, name?: string): Uint8Array {
    return _getBytes(value, name, false);
}
type UnicodeNormalizationForm = "NFC" | "NFD" | "NFKC" | "NFKD";


const _normalizeForms = ["NFD", "NFC", "NFKD", "NFKC"].reduce((accum, form) => {
    try {
        // General test for normalize
        /* c8 ignore start */
        if ("test".normalize(form) !== "test") { throw new Error("bad"); };
        /* c8 ignore stop */

        if (form === "NFD") {
            const check = String.fromCharCode(0xe9).normalize("NFD");
            const expected = String.fromCharCode(0x65, 0x0301)
            /* c8 ignore start */
            if (check !== expected) { throw new Error("broken") }
            /* c8 ignore stop */
        }

        accum.push(form);
    } catch(error) { }

    return accum;
}, <Array<string>>[]);


function assertNormalize(form: string): void {
    assert(_normalizeForms.indexOf(form) >= 0, "platform missing String.prototype.normalize", "UNSUPPORTED_OPERATION", {
        operation: "String.prototype.normalize", info: { form }
    });
}

function toUtf8Bytes(str: string, form?: UnicodeNormalizationForm): Uint8Array {
    assertArgument(typeof(str) === "string", "invalid string value", "str", str);

    if (form != null) {
        assertNormalize(form);
        str = str.normalize(form);
    }

    let result: Array<number> = [];
    for (let i = 0; i < str.length; i++) {
        const c = str.charCodeAt(i);

        if (c < 0x80) {
            result.push(c);

        } else if (c < 0x800) {
            result.push((c >> 6) | 0xc0);
            result.push((c & 0x3f) | 0x80);

        } else if ((c & 0xfc00) == 0xd800) {
            i++;
            const c2 = str.charCodeAt(i);

            assertArgument(i < str.length && ((c2 & 0xfc00) === 0xdc00),
                "invalid surrogate pair", "str", str);

            // Surrogate Pair
            const pair = 0x10000 + ((c & 0x03ff) << 10) + (c2 & 0x03ff);
            result.push((pair >> 18) | 0xf0);
            result.push(((pair >> 12) & 0x3f) | 0x80);
            result.push(((pair >> 6) & 0x3f) | 0x80);
            result.push((pair & 0x3f) | 0x80);

        } else {
            result.push((c >> 12) | 0xe0);
            result.push(((c >> 6) & 0x3f) | 0x80);
            result.push((c & 0x3f) | 0x80);
        }
    }

    return new Uint8Array(result);
};

function getPassword(password: string | Uint8Array): Uint8Array {
    if (typeof(password) === 'string') {
        return toUtf8Bytes(password, "NFKC");
    }
    return getBytesCopy(password);
}
const _scryptSync = function(passwd: Uint8Array, salt: Uint8Array, N: number, r: number, p: number, dkLen: number) {
    return _nobleSync(passwd, salt, { N, r, p, dkLen });
}
let __scryptSync: (passwd: Uint8Array, salt: Uint8Array, N: number, r: number, p: number, dkLen: number) => BytesLike = _scryptSync

function scryptSync(_passwd: BytesLike, _salt: BytesLike, N: number, r: number, p: number, dkLen: number): string {
    const passwd = getBytes(_passwd, "passwd");
    const salt = getBytes(_salt, "salt");
    return hexlify(__scryptSync(passwd, salt, N, r, p, dkLen));
}
/**
 *  Return the JSON Keystore Wallet for %%account%% encrypted with
 *  %%password%%.
 *
 *  The %%options%% can be used to tune the password-based key
 *  derivation function parameters, explicitly set the random values
 *  used. Any provided [[ProgressCallback]] is ignord.
 */
export const encryptKeystoreJson = (account: KeystoreAccount, password: string | Uint8Array, options?: EncryptOptions): string => {
    if (options == null) { options = { }; }

    const passwordBytes = getPassword(password);
    const kdf = getEncryptKdfParams(options);
    const key = scryptSync(passwordBytes, kdf.salt, kdf.N, kdf.r, kdf.p, 64);
    return _encryptKeystore(getBytes(key), kdf, account, options);
}



