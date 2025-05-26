import {GlobalExceptionHandler} from "../../exception/global-exception-handler.js";
import {renderCommonAlertMessage} from "../../alert/js/common-alert-message.js";
import {FetchNetworkException} from "./ApiException.js";

export class ApiExceptionHandler extends GlobalExceptionHandler{
    handle(error){
        if( error instanceof FetchNetworkException ){
            this.handleApiNetworkException(error);
        }
        else{
            super.handle(error)
        }
    }

    handleApiNetworkException(error){
        console.error('[Api Fetch Error]', error );
        renderCommonAlertMessage('네트워크 연결 오류' , `네트워크 연결이 원활하지 않습니다.<br>잠시 후 다시 시도해 주세요.`);
    }
}