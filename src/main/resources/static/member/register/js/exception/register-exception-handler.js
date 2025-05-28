import {GlobalExceptionHandler} from "../../../../global/exception/global-exception-handler.js";
import {ApiResponseException} from "../../../../global/api/exception/ApiException.js";
import {showToastMessage} from "../../../../global/popup/js/common-toast-message.js";

export class RegisterExceptionHandler extends GlobalExceptionHandler{
    handle(error, {context}){
        if(error instanceof ApiResponseException){
            if( context === 'registerMember'){
                this.handleMemberRegisterException(error);
            }
        } else{
            super.handle(error);
        }
    }

    handleMemberRegisterException(error){
        showToastMessage(`${error.message}`, 'error', 3500);
    }
}