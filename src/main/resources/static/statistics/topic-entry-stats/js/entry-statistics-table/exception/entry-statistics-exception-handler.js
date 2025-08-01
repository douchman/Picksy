import {GlobalExceptionHandler} from "../../../../../global/exception/global-exception-handler.js";
import {ApiResponseException} from "../../../../../global/api/exception/ApiException.js";
import {showToastMessage} from "../../../../../global/toast-message/js/common-toast-message.js";

export class EntryStatisticsExceptionHandler extends GlobalExceptionHandler {
    handle(error, {context }) {
        if( error instanceof ApiResponseException){
            if( context === 'entryStatistics' ){
                this.handleGetEntryStatisticsException(error);
            }
        } else {
            super.handle(error);
        }
    }

    handleGetEntryStatisticsException() {
        showToastMessage({
            toastType: 'error',
            title : '통계 정보 조회 실패',
            content : '엔트리 통계정보를 조회할 수 없어요. 새로고침 또는 탭을 닫고 다시 시도해 주세요'
        });
    }
}