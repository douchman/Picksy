import {GlobalExceptionHandler} from "../../../../global/exception/global-exception-handler.js";
import {
    CurrentEntryMatchException,
    SavePlayRecordInfoException,
    SubmitEntryMatchResultException
} from "./TopicPlayException.js";
import {showToastMessage} from "../../../../global/popup/js/common-toast-message.js";
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

      /*  if(error instanceof SavePlayRecordInfoException){
            this.handleSavePlayRecordInfoException(error);
        } else if(error instanceof CurrentEntryMatchException) {
            this.handleCurrentEntryMatchException(error);
        } else if(error instanceof SubmitEntryMatchResultException){
            this.handleSubmitEntryMatchResultException(error);
        } else{
            super.handle(error);
        }*/
    }

    handleSavePlayRecordInfoException(error){
        console.error('[Save PlayRecordInfo Exception]' , error);
        showToastMessage(error.message , 'error', 3500);
        setTimeout(()=> {
            location.href = '/';
        }, 2500);
    }
    handleSaveTopicInfoException(error){
        console.error('[Save TopicInfo Exception]' , error);
        showToastMessage('대결주제 정보를 확인할 수 없어요:(' , 'error', 3500);
        setTimeout(()=> {
            location.href = '/';
        }, 2500);
    }

    handleCurrentEntryMatchException(error){
        console.error('[Current EntryMatch Exception]' , error);
        showToastMessage('진행할 대결 정보 조회를 확인할 수 없습니다.' , 'error', 3500);
        setTimeout(() => {
           location.href = '/';
        }, 2500);
    }

    handleSubmitEntryMatchResultException(error){
        console.error('[Submit EntryMatch Result Exception]' , error);
        showToastMessage('대결 결과 제출 중 문제가 발생했어요. 잠시후 다시 시도해주세요.', 'error', 3500);
    }
}