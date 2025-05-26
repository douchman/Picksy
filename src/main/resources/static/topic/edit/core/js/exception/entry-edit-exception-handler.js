import {GlobalExceptionHandler} from "../../../../../global/exception/global-exception-handler.js";
import {showToastMessage} from "../../../../../global/popup/js/common-toast-message.js";
import {ApiResponseException} from "../../../../../global/api/exception/ApiException";

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
        console.error('[Entry Create Exception]' , error);
        showToastMessage(`${error.message}`, 'error', 2500);
    }

    handleEntryUpdateException(error){
        console.error('[Entry Update Exception]' , error);
        showToastMessage(`${error.message}`, 'error', 2500);
    }

    handleEntryListError(error){
        console.error('[Entry List Exception]' , error);
        showToastMessage(`${error.message}`, 'error', 2500);
    }

}
