import {GlobalExceptionHandler} from "../../../../global/exception/global-exception-handler.js";
import {
    CurrentEntryMatchException,
    SavePlayRecordInfoException,
    SetTopicInfoException,
    SubmitEntryMatchResultException
} from "./TopicPlayException.js";
import {showToastMessage} from "../../../../global/popup/js/common-toast-message.js";

export class TopicPlayExceptionHandler extends GlobalExceptionHandler {
    handle(error) {
        if(error instanceof SavePlayRecordInfoException){
            this.handleSavePlayRecordInfoException(error);
        } else if(error instanceof SetTopicInfoException){
            this.handleSetTopicInfoException(error);
        } else if(error instanceof CurrentEntryMatchException) {
            this.handleCurrentEntryMatchException(error);
        } else if(error instanceof SubmitEntryMatchResultException){
            this.handleSubmitEntryMatchResultException(error);
        } else{
            super.handle(error);
        }
    }

    handleSavePlayRecordInfoException(error){
        console.error('[Save PlayRecordInfo Exception]' , error);
        showToastMessage(error.message , 'error', 3500);
        setTimeout(()=> {
            location.href = '/';
        }, 2500);
    }
    handleSetTopicInfoException(error){
        console.error('[Set TopicInfo Exception]' , error);
        showToastMessage(error.message , 'error', 3500);
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