import {GlobalExceptionHandler} from "../../../../global/exception/global-exception-handler.js";
import {GetMyTopicException} from "./MyTopicException.js";
import {showToastMessage} from "../../../../global/popup/js/common-toast-message.js";

export class MyTopicExceptionHandler extends GlobalExceptionHandler{
    handle(error) {
        if( error instanceof GetMyTopicException ){
            this.handleGetMyTopicException(error);
        } else{
            super.handle(error);
        }
    }

    handleGetMyTopicException(error){
        console.error('[Get MyTopics Exception]' , error);
        showToastMessage(`${error.message}`, 'error', 2500);
    }
}