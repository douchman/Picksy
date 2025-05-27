import {GlobalExceptionHandler} from "../../../../global/exception/global-exception-handler.js";
import {ApiResponseException} from "../../../../global/api/exception/ApiException.js";
import {showToastMessage} from "../../../../global/popup/js/common-toast-message.js";

export class TopicStatisticsExceptionHandler extends GlobalExceptionHandler {
    handle(error, {context }) {
        if( error instanceof ApiResponseException){
            if( context === 'topicStatistics' ){
                this.handleGetTopicStatisticsException(error);
            }
        } else{
            super.handle(error);
        }
    }

    handleGetTopicStatisticsException(error){
        console.error('[Get Topic Statistics Exception]' , error);
        showToastMessage('대결주제 통계 정보를 조회할 수 없어요. 탭을 닫고 다시 진입해 주세요.', 'error', 3000);
    }
}