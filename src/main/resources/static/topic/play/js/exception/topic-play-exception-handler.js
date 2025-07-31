import {GlobalExceptionHandler} from "../../../../global/exception/global-exception-handler.js";
import {showToastMessage} from "../../../../global/toast-message/js/common-toast-message.js";
import {ApiResponseException} from "../../../../global/api/exception/ApiException.js";

export class TopicPlayExceptionHandler extends GlobalExceptionHandler {
    handle(error, {context}) {
        if(error instanceof ApiResponseException){
            if( context === 'topicDetail'){
                this.handleSaveTopicInfoException(error);
            }
            else if( context === 'currentEntryMatch'){
                this.handleCurrentEntryMatchException(error);
            }
            else if( context === 'submitMatchResult'){
                this.handleSubmitEntryMatchResultException(error);
            }
        }
    }
    handleSaveTopicInfoException(){
        showToastMessage({
            toastType: 'error',
            title : '대결주제 확인 불가',
            content : '대결주제 정보를 확인할 수 없어요:('
        });
        setTimeout(()=> {
            location.href = '/';
        }, 2500);
    }

    handleCurrentEntryMatchException(error){
        showToastMessage({
            toastType: 'error',
            title : '엔트리 매치 정보',
            content : error.message
        });
        setTimeout(() => {
           location.href = '/';
        }, 2500);
    }

    handleSubmitEntryMatchResultException(){
        showToastMessage({
            toastType: 'error',
            title : '대결 결과',
            content : '대결 결과 반영 중 문제가 발생했어요. 잠시후 다시 시도해주세요'
        });
    }
}