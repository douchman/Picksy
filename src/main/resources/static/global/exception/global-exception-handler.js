import {renderCommonAlertMessage} from "../alert/js/common-alert-message.js";

export class GlobalExceptionHandler {
    handle(error) {
        this.handleUnknownError(error);
    }

    handleUnknownError(error) {
        console.error('[UnKnown Error]', error);
        renderCommonAlertMessage('오류 발생', '알 수 없는 오류가 발생했습니다.');
    }
}
