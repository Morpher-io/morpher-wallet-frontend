import { ErrorCode, MessageType, Resolution } from './enums';
/**
 * An ACK handshake message.
 */
export declare type AckMessage = {
    penpal: MessageType.Ack;
    methodNames: string[];
};
/**
 * Extract keys of T whose values are assignable to U.
 */
declare type ExtractKeys<T, U> = {
    [P in keyof T]: T[P] extends U ? P : never;
}[keyof T];
/**
 * A mapped type to recursively convert non async methods into async methods and exclude
 * any non function properties from T.
 */
export declare type AsyncMethodReturns<T> = {
    [K in ExtractKeys<T, Function | object>]: T[K] extends (...args: any) => PromiseLike<any> ? T[K] : T[K] extends (...args: infer A) => infer R ? (...args: A) => Promise<R> : AsyncMethodReturns<T[K]>;
};
/**
 * A method call message.
 */
export declare type CallMessage = {
    penpal: MessageType.Call;
    id: number;
    methodName: string;
    args: any[];
};
/**
 * Methods that may be called that will invoke methods on the remote window.
 */
export declare type CallSender = {
    [index: string]: Function;
};
/**
 * Connection object returned from calling connectToChild or connectToParent.
 */
export declare type Connection<TCallSender extends object = CallSender> = {
    /**
     * A promise which will be resolved once a connection has been established.
     */
    promise: Promise<AsyncMethodReturns<TCallSender>>;
    /**
     * A method that, when called, will disconnect any messaging channels.
     * You may call this even before a connection has been established.
     */
    destroy: Function;
};
/**
 * Methods to expose to the remote window.
 */
export declare type Methods = {
    [index: string]: Methods | Function;
};
/**
 * A map of key path to function. The flatted counterpart of Methods.
 */
export declare type SerializedMethods = {
    [index: string]: Function;
};
/**
 * A Penpal-specific error.
 */
export declare type PenpalError = Error & {
    code: ErrorCode;
};
/**
 * A method response message.
 */
export declare type ReplyMessage = {
    penpal: MessageType.Reply;
    id: number;
    resolution: Resolution;
    returnValue: any;
    returnValueIsError?: boolean;
};
/**
 * A SYN-ACK handshake message.
 */
export declare type SynAckMessage = {
    penpal: MessageType.SynAck;
    methodNames: string[];
};
/**
 * A SYN handshake message.
 */
export declare type SynMessage = {
    penpal: MessageType.Syn;
};
export declare type WindowsInfo = {
    /**
     * A friendly name for the local window.
     */
    localName: 'Parent' | 'Child';
    /**
     * The local window.
     */
    local: Window;
    /**
     * The remote window.
     */
    remote: Window;
    /**
     * Origin that should be used for sending messages to the remote window.
     */
    originForSending: string;
    /**
     * Origin that should be used for receiving messages from the remote window.
     */
    originForReceiving: string;
};
export {};
