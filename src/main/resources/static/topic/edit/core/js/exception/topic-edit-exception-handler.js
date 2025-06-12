import {GlobalExceptionHandler} from "../../../../../global/exception/global-exception-handler.js";
import {TopicIdSaveException} from "./TopicEditException.js";
import {showToastMessage} from "../../../../../global/toast-message/js/common-toast-message.js";
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
        showToastMessage(`${error.message}`, 'error', 2500);
    }

    handleTopicUpdateException(error){
        showToastMessage(`${error.message}`, 'error', 2500);
    }

    handleTopicDetailException(error){
        showToastMessage(`${error.message}`, 'error', 2500);
        setTimeout(() => {
            location.href = '/';
        }, 3000)
    }

    handleTopicIdSaveException(){
        showToastMessage('대결주제 정보 확인 중 문제가 발생했어요. 이전 메뉴에서 다시 확인해주세요.', 'alert', 3000);

        setTimeout(() => {
            location.href = '/topic/my';
        }, 2500);
    }
}
