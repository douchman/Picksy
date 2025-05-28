import {GlobalExceptionHandler} from "../../../../../global/exception/global-exception-handler.js";
import {showToastMessage} from "../../../../../global/toast-message/js/common-toast-message.js";
import {ApiResponseException} from "../../../../../global/api/exception/ApiException";

export class CommentsExceptionHandler extends GlobalExceptionHandler {
    handle(error, {context}){
        if( error instanceof ApiResponseException ){
            if( context === 'getComments')
                this.handleGetCommentsException(error);
            else if( context === 'registerComment')
                this.handleRegisterCommentsException(error);
        } else{
            super.handle(error);
        }
    }

    handleGetCommentsException(error){
        console.error('[Get Comments Exception]' , error);
        showToastMessage('댓글 조회 중 문제가 발생했습니다. [대결주제 통계] 페이지를 이용해 주세요.' , 'error', 3000);
    }

    handleRegisterCommentsException(error){
        console.error('[Register Comments Exception]' , error);
        showToastMessage('댓글 작성 중 문제가 발생했습니다. 다시 시도해도 문제가 지속될 경우 [대결주제 통계] 페이지에서 이용바랍니다.' , 'error', 3000);
    }
}