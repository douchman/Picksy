import {GlobalExceptionHandler} from "../../../../../global/exception/global-exception-handler.js";
import {TopicCreateException, TopicUpdateException} from "../../../core/js/exception/TopicEditException.js";
import {showToastMessage} from "../../../../../global/popup/js/common-toast-message.js";

export class TopicCreateExceptionHandler extends GlobalExceptionHandler{
    handle(error){
        if( error instanceof TopicCreateException) {
            this.handleTopicCreateException(error);
        } else if ( error instanceof TopicUpdateException ) {
            this.handleTopicUpdateException(error);
        } else{
            super.handle(error)
        }
    }

    handleTopicCreateException(error){
        console.error('[Topic Create Exception]' , error);
        showToastMessage(`${error.message}`, 'error', 2500);
    }

    handleTopicUpdateException(error){
        console.error('[Topic Update Exception]' , error);
        showToastMessage(`${error.message}`, 'error', 2500);
    }
}
