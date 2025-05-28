import {GlobalExceptionHandler} from "../../../../global/exception/global-exception-handler.js";
import {ApiResponseException} from "../../../../global/api/exception/ApiException.js";
import {showToastMessage} from "../../../../global/toast-message/js/common-toast-message.js";

export class EntryVersusExceptionHandler extends GlobalExceptionHandler{
    handle(error, {context}){
        if(error instanceof ApiResponseException){
            if(context === 'targetEntryStats'){
                this.handleTargetEntryStatisticsException(error);
            } else if( context === 'entryVersusStats'){
                this.handleEntryVersusStatisticsException(error);
            }
        } else{
            super.handle(error);
        }
    }


    handleTargetEntryStatisticsException(error){
        console.error('[Target Entry Stats Exception]', error);
        showToastMessage('엔트리 통계 조회 중 문제가 발생했어요. 새로고침 또는 다시 진입후 이용해주세요.' , 'error', 3500);
    }

    handleEntryVersusStatisticsException(error){
        console.error('[Versus Stats Exception]', error);
        showToastMessage('엔트리 상성 통계 조회 중 문제가 발생했어요. 새로고침 또는 다시 진입후 이용해주세요.' , 'error', 3500);
    }
}