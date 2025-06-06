import { MessageType, NativeEventType } from '../enums';
import createDestructor from '../createDestructor';
import createLogger from '../createLogger';
import getOriginFromSrc from './getOriginFromSrc';
import handleAckMessageFactory from './handleAckMessageFactory';
import handleSynMessageFactory from './handleSynMessageFactory';
import { serializeMethods } from '../methodSerialization';
import monitorIframeRemoval from './monitorIframeRemoval';
import startConnectionTimeout from '../startConnectionTimeout';
import validateIframeHasSrcOrSrcDoc from './validateIframeHasSrcOrSrcDoc';
/**
 * Attempts to establish communication with an iframe.
 */
export default (options) => {
    let { iframe, methods = {}, childOrigin, timeout, debug = false } = options;
    const log = createLogger(debug);
    const destructor = createDestructor('Parent', log);
    const { onDestroy, destroy } = destructor;
    if (!childOrigin) {
        validateIframeHasSrcOrSrcDoc(iframe);
        childOrigin = getOriginFromSrc(iframe.src);
    }
    console.log('childOrigin', childOrigin);
    // If event.origin is "null", the remote protocol is file: or data: and we
    // must post messages with "*" as targetOrigin when sending messages.
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage#Using_window.postMessage_in_extensions
    const originForSending = childOrigin === 'null' ? '*' : childOrigin;
    const serializedMethods = serializeMethods(methods);
    const handleSynMessage = handleSynMessageFactory(log, serializedMethods, childOrigin, originForSending);
    const handleAckMessage = handleAckMessageFactory(serializedMethods, childOrigin, originForSending, destructor, log);
    const promise = new Promise((resolve, reject) => {
        const stopConnectionTimeout = startConnectionTimeout(timeout, destroy);
        const handleMessage = (event) => {
            if (event.source !== iframe.contentWindow || !event.data) {
                return;
            }
            if (event.data.penpal === MessageType.Syn) {
                handleSynMessage(event);
                return;
            }
            if (event.data.penpal === MessageType.Ack) {
                const callSender = handleAckMessage(event);
                if (callSender) {
                    stopConnectionTimeout();
                    resolve(callSender);
                }
                return;
            }
        };
        window.addEventListener(NativeEventType.Message, handleMessage);
        log('Parent: Awaiting handshake');
        monitorIframeRemoval(iframe, destructor);
        onDestroy((error) => {
            window.removeEventListener(NativeEventType.Message, handleMessage);
            if (error) {
                reject(error);
            }
        });
    });
    return {
        promise,
        destroy() {
            // Don't allow consumer to pass an error into destroy.
            destroy();
        },
    };
};
