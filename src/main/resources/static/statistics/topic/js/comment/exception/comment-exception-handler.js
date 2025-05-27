import {GlobalExceptionHandler} from "../../../../../global/exception/global-exception-handler.js";
import {ApiResponseException} from "../../../../../global/api/exception/ApiException.js";
import {showToastMessage} from "../../../../../global/popup/js/common-toast-message.js";

export class CommentExceptionHandler extends GlobalExceptionHandler{
    handle(error, {context}){
        if( error instanceof ApiResponseException){
            if( context === 'getComments')
                this.handleGetCommentsException(error);
            else if(context === 'registerComment')
                this.handleRegisterCommentsException(error);
        } else{
            super.handle(error)
        }
    }

    handleGetCommentsException(error){
        console.error('[Topic Search Exception]' , error);
        showToastMessage('댓글 조회 중 문제가 발생했어요. 새로고침 후 이용해주세요.', 'error', 3000);
    }

    handleRegisterCommentsException(error){
        console.error('[Topic Search Exception]' , error);
        showToastMessage('댓글 작성 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.', 'error', 3000);
    }
}
