import {GlobalExceptionHandler} from "../../../../../global/exception/global-exception-handler.js";
import {showToastMessage} from "../../../../../global/toast-message/js/common-toast-message.js";
import {ApiResponseException} from "../../../../../global/api/exception/ApiException.js";

export class EntryEditExceptionHandler extends GlobalExceptionHandler{
    handle(error, {context}){
        if( error instanceof ApiResponseException) {
            if(context === 'entryCreate')
                this.handleEntryCreateException(error);
            else if(context === 'entryModify')
                this.handleEntryUpdateException(error);
            else if(context === 'entryList')
                this.handleEntryListError(error);
            else if(context === 'entryMediaUpload')
                this.handleEntryMediaUploadException(error);
        }else{
            super.handle(error);
        }
    }

    handleEntryCreateException(error){
        showToastMessage({
            toastType: 'error',
            title : '엔트리 생성 실패',
            content : error.message
        });
    }

    handleEntryUpdateException(error){
        showToastMessage({
            toastType: 'error',
            title : '엔트리 업데이트 실패',
            content : error.message
        });
    }

    handleEntryListError(error){
        showToastMessage({
            toastType: 'error',
            title : '엔트리 조회 실패',
            content : error.message
        });
    }

    handleEntryMediaUploadException(){
        showToastMessage({
            toastType: 'error',
            title : '엔트리 미디어 업로드',
            content : '엔트리 이미지 업로드 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.'
        });
    }

}
