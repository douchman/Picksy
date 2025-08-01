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
            else if( context === 'topicThumbUpload')
                this.handleTopicThumbUploadException();
        }
        else if ( error instanceof TopicIdSaveException ) {
            this.handleTopicIdSaveException(error);
        } else{
            super.handle(error)
        }
    }

    handleTopicCreateException(error){
        showToastMessage({
            toastType: 'error',
            title : '주제 등록 실패',
            content : error.message
        });
    }

    handleTopicUpdateException(error){
        showToastMessage({
            toastType: 'error',
            title : '주제 업데이트 실패',
            content : error.message
        });
    }

    handleTopicDetailException(error){
        showToastMessage({
            toastType: 'error',
            title : '주제 상세정보 조회 실패',
            content : error.message
        });
        setTimeout(() => {
            location.href = '/';
        }, 3000)
    }
    handleTopicThumbUploadException(){
        showToastMessage({
            toastType: 'error',
            title : '대결주제 이미지',
            content : '대결주제 대표이미지 업로드 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요'
        });
    }

    handleTopicIdSaveException(){

        showToastMessage({
            toastType: 'error',
            title : '대결주제 오류',
            content : '대결주제 정보 확인 중 문제가 발생했어요. 이전 메뉴에서 다시 확인해주세요'
        });

        setTimeout(() => {
            location.href = '/topic/my';
        }, 2500);
    }
}
