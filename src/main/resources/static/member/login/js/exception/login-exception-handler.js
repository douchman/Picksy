import {GlobalExceptionHandler} from "../../../../global/exception/global-exception-handler.js";
import {ApiResponseException} from "../../../../global/api/exception/ApiException.js";
import {showToastMessage} from "../../../../global/popup/js/common-toast-message.js";

export class LoginExceptionHandler extends GlobalExceptionHandler{
    handle(error, {context}){
        if( error instanceof ApiResponseException){
            if(context === 'userLogin'){
                this.handleUserLoginException(error);
            }
        } else {
            super.handle(error);
        }
    }

    handleUserLoginException(error){
        console.error('[User Login Exception]', error);
        showToastMessage(`${error.message}`, 'alert', 3500);
    }
}

