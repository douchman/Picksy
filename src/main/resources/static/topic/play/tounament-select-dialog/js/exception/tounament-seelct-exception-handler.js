import {GlobalExceptionHandler} from "../../../../../global/exception/global-exception-handler.js";
import {showToastMessage} from "../../../../../global/popup/js/common-toast-message.js";
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

    handleTopicDetailException(error){
        console.error('[Topic Search Exception]' , error);
        showToastMessage(`${error.message}`, 'error', 2500);
    }

    handlePlayRecordIdException(error){
        console.error('[Tournament Exception]' , error);
        showToastMessage(`${error.message}`, 'error', 2500);
    }
}
