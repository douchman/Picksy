import {GlobalExceptionHandler} from "../../../../global/exception/global-exception-handler.js";
import {showToastMessage} from "../../../../global/toast-message/js/common-toast-message.js";
import {ApiResponseException} from "../../../../global/api/exception/ApiException.js";

export class MyTopicExceptionHandler extends GlobalExceptionHandler{
    handle(error, {context}) {
        if( error instanceof ApiResponseException ){
            if( context === 'topicList')
                this.handleGetMyTopicException(error);
        } else{
            super.handle(error);
        }
    }

    handleGetMyTopicException(error){
        showToastMessage({
            toastType: 'error',
            title : '내 대결주제',
            content : error.message
        });
    }
}