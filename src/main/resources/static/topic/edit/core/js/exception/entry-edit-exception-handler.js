import {GlobalExceptionHandler} from "../../../../../global/exception/global-exception-handler.js";
import {showToastMessage} from "../../../../../global/popup/js/common-toast-message.js";
import {EntryCreateException, EntryListException} from "./EntryEditException.js";

export class EntryEditExceptionHandler extends GlobalExceptionHandler{
    handle(error){
        if( error instanceof EntryCreateException) {
            this.handleEntryCreateException(error);
        } else if ( error instanceof EntryListException){
            this.handleEntryListError(error);
        } else{
            super.handle(error);
        }
    }

    handleEntryCreateException(error){
        console.error('[Topic Create Exception]' , error);
        showToastMessage(`${error.message}`, 'error', 2500);
    }

    handleEntryListError(error){
        console.error('[Entry List Exception]' , error);
        showToastMessage(`${error.message}`, 'error', 2500);
    }

}
