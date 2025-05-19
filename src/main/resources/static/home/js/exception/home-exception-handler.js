import {showToastMessage} from "../../../global/popup/js/common-toast-message.js";
import {GlobalExceptionHandler} from "../../../global/exception/global-exception-handler.js";
import {TopicSearchException} from "./HomeException.js";

export class HomeExceptionHandler extends GlobalExceptionHandler{
    handle(error){
        if( error instanceof TopicSearchException){
            this.handleTopicSearchException(error);
        } else{
            super.handle(error)
        }

    }

    handleTopicSearchException(error){
        console.error('[Topic Search Exception]' , error);
        showToastMessage(`${error.message}`, 'error', 2500);
    }
}
