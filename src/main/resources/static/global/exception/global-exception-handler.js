import {renderCommonAlertMessage} from "../alert/js/common-alert-message.js";
import {UserAuthException} from "./GlobalException.js";
import {FetchNetworkException} from "../api/exception/ApiException.js";

export class GlobalExceptionHandler {
    handle(error) {

        if( error instanceof UserAuthException){
            this.handleUserAuthException(error);
        } else if( error instanceof FetchNetworkException ){
            this.handleApiNetworkException(error);
        }
        this.handleUnknownException(error);
    }

    handleUserAuthException(error){
        console.log('[User Auth Exception]', error);
        if( error.status === 401 ){
            renderCommonAlertMessage(
                '회원 이용 기능',
                '로그인이 필요한 기능입니다.',
                () => {location.href ='/login'});
        } else if( error.status === 403 ){
            renderCommonAlertMessage(
                '권한 없음',
                '이용권한이 없습니다.',
                () => {location.href ='/'});
        }
    }

    handleUnknownException(error) {
        console.error('[UnKnown Exception]', error);
        renderCommonAlertMessage('오류 발생', '알 수 없는 오류가 발생했습니다.');
    }

    handleApiNetworkException(error){
        console.error('[Api Fetch Error]', error );
        renderCommonAlertMessage('네트워크 연결 오류' , `네트워크 연결이 원활하지 않습니다.<br>잠시 후 다시 시도해 주세요.`);
    }
}
