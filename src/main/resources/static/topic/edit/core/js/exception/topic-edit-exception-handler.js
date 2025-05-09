import {GlobalExceptionHandler} from "../../../../../global/exception/global-exception-handler.js";
import {TopicCreateException, TopicIdSaveException, TopicUpdateException} from "./TopicEditException.js";
import {showToastMessage} from "../../../../../global/popup/js/common-toast-message.js";

export class TopicEditExceptionHandler extends GlobalExceptionHandler{
    handle(error){
        if( error instanceof TopicCreateException) {
            this.handleTopicCreateException(error);
        } else if ( error instanceof TopicUpdateException ) {
            this.handleTopicUpdateException(error);
        } else if ( error instanceof TopicIdSaveException ) {
            this.handleTopicIdSaveException(error);
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

    handleTopicIdSaveException(error){
        console.error('[TopicId Save Exception]' , error);
        showToastMessage(`${error.message}`, 'alert', 3000);

        setTimeout(() => {
            location.href = '/';
        }, 2500);
    }
}
