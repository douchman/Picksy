import {showToastMessage} from "../../global/popup/js/common-toast-message.js";

export function handleTopicRenderException(isAuthOrNetworkError, error){
    if( !isAuthOrNetworkError) {
        const errorCode = error.errorCode;
        const message = error.message;
        switch (errorCode){
            default:
                showToastMessage(`${message}`, error, 3000);
        }
    }

}

export function handleTopicTournamentException(isAuthOrNetworkError, error){
    if( !isAuthOrNetworkError ) {
        const errorCode = error.errorCode;
        const message = error.message;

        switch (errorCode){
            default:
                showToastMessage(`${message}`, error, 3000);
        }
    }
}