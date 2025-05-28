import {showToastMessage} from "../../../global/toast-message/js/common-toast-message.js";
import {GlobalExceptionHandler} from "../../../global/exception/global-exception-handler.js";
import {ApiResponseException} from "../../../global/api/exception/ApiException.js";

export class HomeExceptionHandler extends GlobalExceptionHandler{
    handle(error){
        if( error instanceof ApiResponseException){
            this.handleApiResponseException(error);
        } else{
            super.handle(error)
        }
    }

    handleApiResponseException(error){
        console.error('[Topic Search Exception]' , error);
        showToastMessage(`${error.message}`, 'error', 3000);
    }
}
