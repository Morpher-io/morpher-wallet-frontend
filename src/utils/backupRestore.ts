import { getKeystore } from './keystore'
import { cryptoEncrypt, cryptoDecrypt, sha256 } from './cryptoFunctions'

import type {
  TypeEncryptedSeed,
  TypePayloadData,
  TypeCreatedKeystore,
  TypeNonceData
} from '../types/global-types'

import { i18n } from '../plugins/i18n'
import { getSessionStore } from '@/utils/sessionStore'
import type { HDAccount } from 'viem'

const getBackendEndpoint = () => {
  return import.meta.env.VITE_BACKEND_ENDPOINT || 'http://localhost:8080'
}

const changePasswordEncryptedSeed = async (
  encryptedSeed: TypeEncryptedSeed,
  oldPassword: string,
  newPassword: string
) => {
  const seed = await cryptoDecrypt(
    oldPassword,
    encryptedSeed.ciphertext || '',
    encryptedSeed.iv || '',
    encryptedSeed.salt || ''
  )
  return await cryptoEncrypt(newPassword, seed)
}

const getKeystoreFromEncryptedSeed = async (
  encryptedWalletObject: TypeEncryptedSeed,
  password: string
): Promise<HDAccount> =>
  new Promise((resolve, reject) => {
    getKeystore(password, encryptedWalletObject, 0)
      .then((returnObj: TypeCreatedKeystore) => {
        resolve(returnObj.keystore)
      })
      .catch((error: Error) => {
        reject(error)
      })
  })

const getEncryptedSeedFromMail = async (
  fetch_key: string,
  email: string,
  email2fa: string,
  authenticator2fa: string,
  recaptchaToken: string,
  token: string,
  recoveryTypeId: number
) =>
  new Promise<TypeEncryptedSeed>((resolve, reject) => {
    if (email && email.includes('@')) {
      email = email.toLowerCase()
    }
    sha256(fetch_key.toLowerCase()).then((key: string) => {
      const options: RequestInit = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          key,
          email,
          email2fa,
          authenticator2fa,
          recaptcha: recaptchaToken,
          access_token: token,
          recovery_type: recoveryTypeId
        }),
        mode: 'cors',
        cache: 'default'
      }

      fetch(getBackendEndpoint() + '/v1/getEncryptedSeed', options)
        .then((response) => {
          response
            .json()
            .then((responseBody) => {
              /**
               * Login /Create Wallet is in one function
               * @todo: Separate Login and Create Wallet into separate functions so that upon failed "login" a recovery can be suggested
               */
              if (responseBody.success) {
                /**
                 * Wallet was found on server, attempting to decrypt with the password
                 */
                resolve(JSON.parse(responseBody.encryptedSeed))
              }
              if (responseBody.error && responseBody.error === 'RECAPTCHA_REQUIRED') {
                reject(responseBody)
              } else {
                if (responseBody.error.includes('_')) {
                  reject(responseBody.error.toString())
                } else {
                  reject('seed not found')
                }
              }
            })
            .catch((err) => {
              reject(err)
            })
        })
        .catch((err) => {
          reject(err)
        })
    })
  })

const validateInput = async (fieldName: string, inputFieldValue: string) => {
  const options: RequestInit = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      fieldName,
      inputFieldValue
    }),
    mode: 'cors',
    cache: 'default'
  }

  try {
    const result = await fetch(getBackendEndpoint() + '/v1/validateInput', options)

    const response = await result.json()

    if (fieldName === 'email') {
      if (response.success === false) return i18n.t('email.EMAIL_ERROR').toString()
    }

    if (fieldName === 'password') {
      if (response.success === false) {
        let badPasswordMessage = 'Password must have'

        for (const reason of response.validationFails) {
          if (reason === 'min') badPasswordMessage += ' at least 8 characters,'
          if (reason === 'uppercase') badPasswordMessage += ' at least 1 uppercase character,'
          if (reason === 'lowercase') badPasswordMessage += ' at least 1 lowercase character,'
          if (reason === 'digits') badPasswordMessage += ' at least 1 numerical digit,'
        }

        badPasswordMessage = badPasswordMessage.slice(0, -1) + '.'
        return badPasswordMessage
      }
    }
  } catch (e) {
    return
  }
}

const saveWalletEmailPassword = async (
  userEmail: string,
  encryptedSeed: TypeEncryptedSeed,
  ethAddress: string,
  recaptchaToken: string,
  recoveryTypeId: number,
  token: string,
  fetch_key: string
) => {
  return new Promise<any>(async (resolve, reject) => {
    try {
      const key = await sha256(fetch_key.toLowerCase() || userEmail.toLowerCase())
      const options: RequestInit = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          key,
          encryptedSeed,
          email: userEmail.toLowerCase(),
          ethAddress,
          recaptcha: recaptchaToken,
          recovery_type: recoveryTypeId,
          access_token: token
        }),
        mode: 'cors',
        cache: 'default'
      }
      const result = await fetch(getBackendEndpoint() + '/v1/saveEmailPassword', options)

      if (result.status != 200) {
        try {
          const response = await result.json()
          if (response.success == false) {
            return reject(response.error)
          }
        } catch (e) {
          return reject(result.statusText)
        }
      }

      const response = await result.json()
      resolve(response)
    } catch (err) {
      reject(err)
    }
  })
}

const recoverSeedSocialRecovery = async (
  key: string,
  accessToken: string,
  signupEmail: string,
  recoveryTypeId: number
) =>
  new Promise((resolve, reject) => {

    if (signupEmail && signupEmail.includes('@')) {
      signupEmail = signupEmail.toLowerCase()
    }

    const options: RequestInit = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        key,
        access_token: accessToken,
        signupEmail,
        recovery_type: recoveryTypeId
      }),
      mode: 'cors',
      cache: 'default'
    }
    fetch(getBackendEndpoint() + '/v1/recoverSeedSocialRecovery', options)
      .then((r) => {
        r.json().then(async (responseBody) => {
          if (responseBody.success) {
            //initiate recovery
            const encryptedSeed = JSON.parse(responseBody.encryptedSeed)
            resolve(encryptedSeed)
          } else {
            reject(
              "Your account wasn't found with Facebook recovery, create one with username and password first"
            )
          }
        })
      })
      .catch((err) => {
        reject(err)
      })
  })

const getPayload = (email: string, recaptchaToken = '', key = '') =>
  new Promise<TypePayloadData>(async (resolve, reject) => {
    try {
      if (!key) {
        key = await sha256(email.toLowerCase())
      }

      const options: RequestInit = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          key,
          recaptcha: recaptchaToken
        }),
        mode: 'cors',
        cache: 'default'
      }
      const result = await fetch(getBackendEndpoint() + '/v1/getPayload', options)

      if (result.status != 200) {
        try {
          const response = await result.json()
          if (response.success == false) {
            return reject(response.error)
          }
        } catch (e) {
          return reject(result.statusText)
        }
      }

      const response: TypePayloadData = await result.json()

      resolve(response)
    } catch (err) {
      reject(err)
    }
  })

const getNonce = async (key: string, retry = 0) => {
  return new Promise<TypeNonceData>(async (resolve, reject) => {
    const options: RequestInit = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        key,
        retry
      }),
      mode: 'cors',
      cache: 'default'
    }
    const result = await fetch(getBackendEndpoint() + '/v1/getNonce', options)

    if (result.status != 200) {
      try {
        const response = await result.json()
        if (response.success == false) {
          return reject(response.error)
        }
      } catch (e) {
        return reject(result.statusText)
      }
    }

    const response = await result.json()

    if (response.nonce == null) {
      retry += 1

      if (retry > 10) {
        return resolve(response)
      } else {
        setTimeout(async () => {
          return resolve(await getNonce(key, retry))
        }, 1000)
      }
    } else {
      return resolve(response)
    }
  })
}

const send2FAEmail = async (email: string, fetch_key: string, page?: string) => {
  let key
  if (fetch_key) {
    key = await sha256(fetch_key)
  } else {
    key = sessionStorage.getItem('fetch_key')
  }

  if (!key) {
    key = await sha256(email.toLowerCase())
  }

  const options: RequestInit = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      key,
      email,
      page: page || 'unknown'
    }),
    mode: 'cors',
    cache: 'default'
  }

  const result = await fetch(getBackendEndpoint() + '/v1/send2FAEmail', options)

  if (result.ok) {
    const response = await result.json()

    return response
  }

  return result
}

const verifyAuthenticatorCode = async (email: string, code: string) => {
  let key = await getSessionStore('fetch_key')
  if (!key) {
    key = await sha256(email.toLowerCase())
  }
  const options: RequestInit = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      key,
      code
    }),
    mode: 'cors',
    cache: 'default'
  }
  try {
    const result = await fetch(getBackendEndpoint() + '/v1/verifyAuthenticatorCode', options)
    //it will throw an exception if it fails
    const response = await result.json()

    return response
  } catch (e) {
    return {
      success: false,
      error: e
    }
  }
}

const verifyEmailCode = async (email: string, code: string) => {
  if (email == '' || code == '') {
    return {
      success: false,
      error: 'CANNOT_VERIFY_EMAIL_CODE'
    }
  }
  let key = await getSessionStore('fetch_key')
  if (!key) {
    key = await sha256(email.toLowerCase())
  }

  const options: RequestInit = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      key,
      code
    }),
    mode: 'cors',
    cache: 'default'
  }
  try {
    const result = await fetch(getBackendEndpoint() + '/v1/verifyEmailCode', options)
    const body = await result.json()
    return body
  } catch (e) {
    return {
      success: false,
      error: e
    }
  }
}

const verifyEmailConfirmationCode = async (email: string, code: string) => {
  if (email == '' || code == '') {
    return {
      success: false,
      error: 'CANNOT_VERIFY_EMAIL_CODE'
    }
  }
  let key = await getSessionStore('fetch_key')
  if (!key) {
    key = await sha256(email.toLowerCase())
  }

  const options: RequestInit = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      key,
      code
    }),
    mode: 'cors',
    cache: 'default'
  }
  try {
    const result = await fetch(getBackendEndpoint() + '/v1/verifyEmailConfirmationCode', options)
    const body = await result.json()
    return body
  } catch (e) {
    return {
      success: false,
      error: e
    }
  }
}

export {
  validateInput,
  saveWalletEmailPassword,
  getKeystoreFromEncryptedSeed,
  changePasswordEncryptedSeed,
  recoverSeedSocialRecovery,
  getEncryptedSeedFromMail,
  getPayload,
  getNonce,
  send2FAEmail,
  verifyAuthenticatorCode,
  verifyEmailCode,
  getBackendEndpoint,
  verifyEmailConfirmationCode
}
