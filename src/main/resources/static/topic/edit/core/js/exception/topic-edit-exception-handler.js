import {GlobalExceptionHandler} from "../../../../../global/exception/global-exception-handler.js";
import {TopicIdSaveException} from "./TopicEditException.js";
import {showToastMessage} from "../../../../../global/popup/js/common-toast-message.js";
import {ApiResponseException} from "../../../../../global/api/exception/ApiException.js";

export class TopicEditExceptionHandler extends GlobalExceptionHandler{
    handle(error, {context}){
        if( error instanceof ApiResponseException) {
            if( context === 'topicCreate')
                this.handleTopicCreateException(error);
            else if ( context === 'topicModify')
                this.handleTopicUpdateException(error);
            else if( context === 'topicDetail')
                this.handleTopicDetailException(error);
        }
        else if ( error instanceof TopicIdSaveException ) {
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

    handleTopicDetailException(error){
        console.error('[Topic Detail Exception]' , error);
        showToastMessage(`${error.message}`, 'error', 2500);
        setTimeout(() => {
            location.href = '/';
        }, 3000)
    }

    handleTopicIdSaveException(error){
        console.error('[TopicId Save Exception]' , error);
        showToastMessage(`${error.message}`, 'alert', 3000);

        setTimeout(() => {
            location.href = '/';
        }, 2500);
    }
}
