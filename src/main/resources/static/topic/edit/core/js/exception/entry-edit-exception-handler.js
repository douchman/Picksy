import {GlobalExceptionHandler} from "../../../../../global/exception/global-exception-handler.js";
import {showToastMessage} from "../../../../../global/popup/js/common-toast-message.js";
import {EntryCreateException} from "./EntryEditException.js";

export class EntryEditExceptionHandler extends GlobalExceptionHandler{
    handle(error){
        if( error instanceof EntryCreateException) {
            this.handleEntryCreateException(error);
        }  else{
            super.handle(error);
        }
    }

    handleEntryCreateException(error){
        console.error('[Topic Create Exception]' , error);
        showToastMessage(`${error.message}`, 'error', 2500);
    }

}
