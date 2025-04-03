import {showToastMessage} from "../../global/popup/js/common-toast-message.js";

export function handleTopicRenderException(error){
    const errorCode = error.errorCode;
    const message = error.message;

    switch (errorCode){
        default:
            showToastMessage(`${message}`, error, 3000);
    }
}

export function handleTopicTournamentException(error){
    const errorCode = error.errorCode;
    const message = error.message;

    switch (errorCode){
        default:
            showToastMessage(`${message}`, error, 3000);
    }
}