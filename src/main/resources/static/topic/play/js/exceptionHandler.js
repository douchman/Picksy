import {showToastMessage} from "../../../global/popup/js/common-toast-message.js";

export function handleTopicPlayException(error){
    const errorCode = error.errorCode;
    const message = error.message;


    switch (errorCode){
        case 'PLAY_RECORD_ALREADY_COMPLETED' :
            showToastMessage(`${message}`, 'alert', 3000);
            backToMainPage();
            break;
        case 'MATCH_ALREADY_COMPLETED' :
            showToastMessage(`${message}`, 'alert', 3000);
            backToMainPage();
            break;
        default:
            showToastMessage(`${message}`, 'error', 3000);
            break;
    }
}

function backToMainPage(){
    setTimeout(() => {
        location.href = '/';
    }, 2000);
}