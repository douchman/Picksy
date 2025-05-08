import {GlobalExceptionHandler} from "../../../../global/exception/global-exception-handler.js";
import {GetCommentsException} from "./CommentException.js";
import {showToastMessage} from "../../../../global/popup/js/common-toast-message.js";

export class CommentsExceptionHandler extends GlobalExceptionHandler {
    handle(error){
        if( error instanceof GetCommentsException ){
            this.handleGetCommentsException(error)
        } else{
            super.handle(error);
        }
    }

    handleGetCommentsException(error){
        console.error('[Get Comments Exception]' , error);
        showToastMessage(error.message , 'error', 3000);
    }
}