import {GlobalExceptionHandler} from "../../../../../global/exception/global-exception-handler.js";
import {showToastMessage} from "../../../../../global/toast-message/js/common-toast-message.js";
import {ApiResponseException} from "../../../../../global/api/exception/ApiException.js";

export class EntryEditExceptionHandler extends GlobalExceptionHandler{
    handle(error, {context}){
        if( error instanceof ApiResponseException) {
            if(context === 'entryCreate')
                this.handleEntryCreateException(error);
            else if(context === 'entryModify')
                this.handleEntryUpdateException(error);
            else if(context === 'entryList')
                this.handleEntryListError(error);
        }else{
            super.handle(error);
        }
    }

    handleEntryCreateException(error){
        showToastMessage(`${error.message}`, 'error', 2500);
    }

    handleEntryUpdateException(error){
        showToastMessage(`${error.message}`, 'error', 2500);
    }

    handleEntryListError(error){
        showToastMessage(`${error.message}`, 'error', 2500);
    }

}
