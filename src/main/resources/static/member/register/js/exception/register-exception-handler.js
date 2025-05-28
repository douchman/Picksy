import {GlobalExceptionHandler} from "../../../../global/exception/global-exception-handler.js";
import {ApiResponseException} from "../../../../global/api/exception/ApiException.js";
import {showToastMessage} from "../../../../global/popup/js/common-toast-message.js";

export class RegisterExceptionHandler extends GlobalExceptionHandler{
    handle(error, {context}){
        if(error instanceof ApiResponseException){
            if( context === 'registerMember'){
                this.handleMemberRegisterException(error);
            }
        } else{
            super.handle(error);
        }
    }

    handleMemberRegisterException(error){
        console.error('[Member Register Exception]', error);
        showToastMessage('회원등록 중 문제가 발생했습니다. 입력사항을 확인 후 다시 시도해주세요', 'error', 3500);
    }
}