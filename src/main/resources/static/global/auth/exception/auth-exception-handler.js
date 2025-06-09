import {GlobalExceptionHandler} from "../../exception/global-exception-handler.js";
import {showToastMessage} from "../../toast-message/js/common-toast-message.js";
import {ApiResponseException} from "../../api/exception/ApiException.js";

export class AuthExceptionHandler extends GlobalExceptionHandler{
    handle(error, {context}){
        if( error instanceof ApiResponseException){
            if( context === 'checkAuthState')
                this.handleMemberAuthCheckException(error);
            else if ( context === 'logout')
                this.handleLogoutException(error);
        } else{
            super.handle(error)
        }

    }

    handleMemberAuthCheckException(){
        showToastMessage(`회원정보를 확인 중 문제가 발생했습니다. 다시 로그인 후 이용해주세요`, 'error', 3500);
    }

    handleLogoutException(){
        showToastMessage(`로그아웃 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.`, 'error', 3500);
    }
}
