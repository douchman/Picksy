import {showToastMessage} from "../../../../global/popup/js/common-toast-message.js";

export function handleEntryRegisterException(isAuthOrNetworkError, registerResult){
    if( !isAuthOrNetworkError ){
        showToastMessage(registerResult.message, 'error', 2000);
    }
}