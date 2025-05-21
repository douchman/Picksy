import {GlobalExceptionHandler} from "../../../../../global/exception/global-exception-handler.js";
import {PlayRecordIdException, TopicDetailException} from "./TournamentSelectException.js";
import {showToastMessage} from "../../../../../global/popup/js/common-toast-message.js";

export class TournamentSelectExceptionHandler extends GlobalExceptionHandler{
    handle(error){
        if( error instanceof TopicDetailException){
            this.handleTopicDetailException(error);
        } else if (error instanceof PlayRecordIdException){
            this.handlePlayRecordIdException(error);
        } else{
            super.handle(error)
        }

    }

    handleTopicDetailException(error){
        console.error('[Topic Search Exception]' , error);
        showToastMessage(`${error.message}`, 'error', 2500);
    }

    handlePlayRecordIdException(error){
        console.error('[Tournament Exception]' , error);
        showToastMessage(`${error.message}`, 'error', 2500);
    }
}
