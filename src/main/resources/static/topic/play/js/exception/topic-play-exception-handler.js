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
            if( context === 'topicDetail')
                this.handleSaveTopicInfoException(error);
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
        showToastMessage(error.message , 'error', 3500);
        setTimeout(() => {
           location.href = '/';
        }, 2500);
    }

    handleSubmitEntryMatchResultException(error){
        console.error('[Submit EntryMatch Result Exception]' , error);
        showToastMessage(error.message , 'error', 3500);
    }
}