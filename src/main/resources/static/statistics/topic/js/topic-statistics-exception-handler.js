import {showToastMessage} from "../../../global/popup/js/common-toast-message.js";

export function handleRenderTopicStatsException(isAuthOrNetworkError, error ){
    if(!isAuthOrNetworkError){

        const errorCode = error.errorCode;
        const message = error.message;

        switch (errorCode){
            case 'TOPIC_NOT_FOUND':
            case 'TOPIC_NOT_PUBLIC':
                showToastMessage(`${message}`, 'alert', 3000);
                // TODO : 오류 페이지 추가 후 이동 필요
                break;
            default :
                showToastMessage(`${message}`, 'alert', 3000);
        }
    }
}

export function handleRenderEntryStatsException(isAuthOrNetworkError, error){
    if(!isAuthOrNetworkError){

        const errorCode = error.errorCode;
        const message = error.message;

        switch (errorCode){
            case 'TOPIC_NOT_FOUND':
                showToastMessage(`${message}`, 'alert', 3000);
                break;
            default :
                showToastMessage(`${message}`, 'alert', 3000);
        }
    }
}