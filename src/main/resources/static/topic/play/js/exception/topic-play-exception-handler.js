import {GlobalExceptionHandler} from "../../../../global/exception/global-exception-handler.js";
import {CurrentEntryMatchException, SavePlayRecordInfoException, SetTopicInfoException} from "./TopicPlayException.js";
import {showToastMessage} from "../../../../global/popup/js/common-toast-message.js";

export class TopicPlayExceptionHandler extends GlobalExceptionHandler {
    handle(error) {
        if(error instanceof SavePlayRecordInfoException){
            this.handleSavePlayRecordInfoException(error);
        } else if(error instanceof SetTopicInfoException){
            this.handleSetTopicInfoException(error);
        } else if(error instanceof CurrentEntryMatchException) {
           this.handleCurrentEntryMatch(error);
        } else{
            super.handle(error);
        }
    }

    handleSavePlayRecordInfoException(error){
        showToastMessage(error.message , 'error', 3500);
        setTimeout(()=> {
            location.href = '/';
        }, 2500);
    }
    handleSetTopicInfoException(error){
        showToastMessage(error.message , 'error', 3500);
        setTimeout(()=> {
            location.href = '/';
        }, 2500);
    }

    handleCurrentEntryMatch(error){
        console.error('[Current EntryMatch Exception]' , error);
        showToastMessage(error.message , 'error', 3500);
        setTimeout(() => {
           location.href = '/';
        }, 2500);
    }
}