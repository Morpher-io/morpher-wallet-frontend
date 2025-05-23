import { Methods, CallSender, AsyncMethodReturns } from '../types';
declare type Options = {
    /**
     * Valid parent origin used to restrict communication.
     */
    parentOrigin?: string | RegExp;
    /**
     * Methods that may be called by the parent window.
     */
    methods?: Methods;
    /**
     * The amount of time, in milliseconds, Penpal should wait
     * for the parent to respond before rejecting the connection promise.
     */
    timeout?: number;
    /**
     * Whether log messages should be emitted to the console.
     */
    debug?: boolean;
};
declare type Connection<TCallSender extends object = CallSender> = {
    /**
     * A promise which will be resolved once a connection has been established.
     */
    promise: Promise<AsyncMethodReturns<TCallSender>>;
    /**
     * A method that, when called, will disconnect any messaging channels.
     * You may call this even before a connection has been established.
     */
    destroy: Function;
    getOrigin: Function;
};
declare const _default: <TCallSender extends object = CallSender>(options?: Options) => Connection<TCallSender>;
/**
 * Attempts to establish communication with the parent window.
 */
export default _default;
