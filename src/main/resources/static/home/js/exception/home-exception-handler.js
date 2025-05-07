import {showToastMessage} from "../../../global/popup/js/common-toast-message.js";
import {GlobalExceptionHandler} from "../../../global/exception/global-exception-handler.js";
import {TopicSearchException, TournamentException} from "./HomeException.js";

export class HomeExceptionHandler extends GlobalExceptionHandler{
    handle(error){
        if( error instanceof TopicSearchException){
            this.handleTopicSearchException(error);
        } else if (error instanceof TournamentException){
            this.handleTournamentException(error);
        }

    }

    handleTopicSearchException(error){
        console.error('[Topic Search Exception]' , error);
        showToastMessage(`${error.message}`, 'error', 2500);
    }

    handleTournamentException(error){
        console.error('[Tournament Exception]' , error);
        showToastMessage(`${error.message}`, 'error', 2500);
    }
}
