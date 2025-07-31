import {GlobalExceptionHandler} from "../../../../../global/exception/global-exception-handler.js";
import {showToastMessage} from "../../../../../global/toast-message/js/common-toast-message.js";
import {ApiResponseException} from "../../../../../global/api/exception/ApiException.js";

export class TournamentSelectExceptionHandler extends GlobalExceptionHandler{
    handle(error, {context}){
        if( error instanceof ApiResponseException){
            if(context === 'topicDetail')
                this.handleTopicDetailException(error);
            else if ( context === 'playRecordId')
                this.handlePlayRecordIdException(error);
        } else{
            super.handle(error)
        }
    }

    handleTopicDetailException(){
        showToastMessage({
            toastType: 'error',
            title : '대결주제 상세정보',
            content : '대결주제 상세정보 조회 중 문제가 발생했어요. 잠시 후 다시 입장해주세요'
        });
    }

    handlePlayRecordIdException(error){
        showToastMessage({
            toastType: 'error',
            title : '대결 기록 정보',
            content : error.message
        });
    }
}
