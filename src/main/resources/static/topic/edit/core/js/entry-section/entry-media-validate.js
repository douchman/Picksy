import {showToastMessage} from "../../../../../global/toast-message/js/common-toast-message.js";
import {MediaType} from "../../../../../global/const/const.js";
import {stagedEntryMedia} from "../staged-entry-media.js";

let hasShownUploadSizeWarning = false;

const MAX_IMAGE_SIZE_MB = 2; // 업로드 가능 비디오 용량 2MB
const MAX_VIDEO_SIZE_MB = 8; // 업로드 가능 비디오 용량 3MB
const ALERT_TOTAL_UPLOAD_MB = 40; // 업로드 경고 요량 기준 40MB
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;
const MAX_VIDEO_SIZE_BYTES = MAX_VIDEO_SIZE_MB * 1024 * 1024;
const ALERT_TOTAL_UPLOAD_BYTES = ALERT_TOTAL_UPLOAD_MB * 1024 * 1024;

// 업로드 대상 파일 검사
export function validateUploadFile(mediaType, uploadFile){
    const label = mediaType === MediaType.IMAGE ? '이미지' : '비디오';
    const reason =  mediaType === MediaType.IMAGE ? '이미지 크기를 줄여' : '비디오 길이나 화질을 줄여';
    const limitBytes = mediaType === MediaType.IMAGE ? MAX_IMAGE_SIZE_BYTES : MAX_VIDEO_SIZE_BYTES;
    const limitMb = mediaType === MediaType.IMAGE ? MAX_IMAGE_SIZE_MB : MAX_VIDEO_SIZE_MB;
    const fileName = uploadFile.name;

    if(uploadFile.size > limitBytes){
        showToastMessage({
            toastType : 'error',
            title : `${label} 용량 초과`,
            content : `${label} <b>${fileName}</b> 파일은 ${limitMb}MB 를 초과하여 업로드 할 수 없어요</br>${reason} 다시 시도해 주세요.`,
            delay : 12000
        });
        return false;
    }
    return true;
}

export function checkTotalUploadSize(){
    if( hasShownUploadSizeWarning ) return;
    const totalUploadFilesSizeBytes = Object.values(stagedEntryMedia).reduce((totalSize, entry) => {
        const file = entry.media;
        return file instanceof File ? totalSize + file.size : totalSize;
    },0); // totalSize 초기값 0

    if(totalUploadFilesSizeBytes > ALERT_TOTAL_UPLOAD_BYTES){
        showToastMessage({
            toastType : 'alert',
            title : '업로드 용량이 많습니다.',
            content : '등록된 파일의 총 용량이 많아 <b>업로드에 시간이 조금 더 걸릴 수 있어요.</b>',
            delay: 20000
        });
        hasShownUploadSizeWarning = true;
    } else{
        hasShownUploadSizeWarning = false;
    }
}