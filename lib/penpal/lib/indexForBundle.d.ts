import { ErrorCode } from './enums';
declare const _default: {
    connectToChild: <TCallSender extends object = import("./types").CallSender>(options: {
        iframe: HTMLIFrameElement;
        methods?: import("./types").Methods | undefined;
        childOrigin?: string | undefined;
        timeout?: number | undefined;
        debug?: boolean | undefined;
    }) => import("./types").Connection<TCallSender>;
    connectToParent: <TCallSender_1 extends object = import("./types").CallSender>(options?: {
        parentOrigin?: string | RegExp | undefined;
        methods?: import("./types").Methods | undefined;
        timeout?: number | undefined;
        debug?: boolean | undefined;
    }) => {
        promise: Promise<import("./types").AsyncMethodReturns<TCallSender_1>>;
        destroy: Function;
        getOrigin: Function;
    };
    ErrorCode: typeof ErrorCode;
};
export default _default;
