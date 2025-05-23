import createDestructor from '../createDestructor';
import createLogger from '../createLogger';
import { MessageType, NativeEventType } from '../enums';
import handleSynAckMessageFactory from './handleSynAckMessageFactory';
import { serializeMethods } from '../methodSerialization';
import startConnectionTimeout from '../startConnectionTimeout';
const areGlobalsAccessible = () => {
    try {
        let c = clearTimeout;
        c();
    }
    catch (e) {
        return false;
    }
    return true;
};
/**
 * Attempts to establish communication with the parent window.
 */
export default (options = {}) => {
    const { parentOrigin = '*', methods = {}, timeout, debug = false } = options;
    const log = createLogger(debug);
    const destructor = createDestructor('Child', log);
    const { destroy, onDestroy } = destructor;
    const serializedMethods = serializeMethods(methods);
    let origin = '';
    const handleSynAckMessage = handleSynAckMessageFactory(parentOrigin, serializedMethods, destructor, log);
    const sendSynMessage = () => {
        log('Child: Handshake - Sending SYN');
        const synMessage = { penpal: MessageType.Syn };
        const parentOriginForSyn = parentOrigin instanceof RegExp ? '*' : parentOrigin;
        window.parent.postMessage(synMessage, parentOriginForSyn);
    };
    const promise = new Promise((resolve, reject) => {
        const stopConnectionTimeout = startConnectionTimeout(timeout, destroy);
        const handleMessage = (event) => {
            if (!origin) {
                if (event.data.penpal === MessageType.SynAck) {
                    origin = event.origin;
                }
            }
            else {
                if (origin !== event.origin) {
                    throw 'multiple origins unsupported - origin set to ' + origin;
                }
            }
            // Under niche scenarios, we get into this function after
            // the iframe has been removed from the DOM. In Edge, this
            // results in "Object expected" errors being thrown when we
            // try to access properties on window (global properties).
            // For this reason, we try to access a global up front (clearTimeout)
            // and if it fails we can assume the iframe has been removed
            // and we ignore the message event.
            if (!areGlobalsAccessible()) {
                return;
            }
            if (event.source !== parent || !event.data) {
                return;
            }
            if (event.data.penpal === MessageType.SynAck) {
                const callSender = handleSynAckMessage(event);
                if (callSender) {
                    window.removeEventListener(NativeEventType.Message, handleMessage);
                    stopConnectionTimeout();
                    resolve(callSender);
                }
            }
        };
        window.addEventListener(NativeEventType.Message, handleMessage);
        sendSynMessage();
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
        getOrigin() {
            return origin;
        }
    };
};
