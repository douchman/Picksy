import {GlobalExceptionHandler} from "../../../../global/exception/global-exception-handler";
import {SavePlayRecordInfoException, SetTopicInfoException} from "./TopicPlayException";
import {showToastMessage} from "../../../../global/popup/js/common-toast-message";

export class TopicPlayExceptionHandler extends GlobalExceptionHandler {
    handle(error) {
        if(error instanceof SavePlayRecordInfoException){
            this.handleSavePlayRecordInfoException(error);
        } else if(error instanceof SetTopicInfoException){
            this.handleSetTopicInfoException(error);
        }
        else {
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
}