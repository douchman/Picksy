import {GlobalExceptionHandler} from "../../../../global/exception/global-exception-handler.js";
import {ApiResponseException} from "../../../../global/api/exception/ApiException.js";
import {showToastMessage} from "../../../../global/toast-message/js/common-toast-message.js";
import {UserAuthException} from "../../../../global/exception/GlobalException.js";

export class LoginExceptionHandler extends GlobalExceptionHandler{
    handle(error, {context}){
        if( error instanceof UserAuthException){
            this.handleUserAuthException(error);
        } else if(error instanceof ApiResponseException ){
            if(context === 'userLogin'){
                this.handleUserLoginException();
            }
        }
        else {
            super.handle(error);
        }
    }

    handleUserAuthException(error){
        showToastMessage(`${error.message}`, 'alert', 3500);
    }

    handleUserLoginException(){
        showToastMessage(`로그인 처리 중 문제가 발생했습니다. 아이디 비밀번호를 확인 후 다시 시도해주세요.`, 'error', 3500);
    }
}

