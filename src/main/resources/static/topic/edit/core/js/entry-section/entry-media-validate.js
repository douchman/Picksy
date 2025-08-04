import {showToastMessage} from "../../../../../global/toast-message/js/common-toast-message.js";
import {MediaType} from "../../../../../global/const/const.js";

const MAX_IMAGE_SIZE_MB = 2; // 업로드 가능 비디오 용량 2MB
const MAX_VIDEO_SIZE_MB = 3; // 업로드 가능 비디오 용량 3MB
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;
const MAX_VIDEO_SIZE_BYTES = MAX_VIDEO_SIZE_MB * 1024 * 1024;

// 업로드 대상 파일 검사
export function validateUploadFile(mediaType, uploadFile){
    const label = mediaType === MediaType.IMAGE ? '이미지' : '비디오';
    const reason =  mediaType === MediaType.IMAGE ? '이미지 크기를 줄여' : '비디오 길이나 화질을 줄여';
    const limitBytes = mediaType === MediaType.IMAGE ? MAX_IMAGE_SIZE_BYTES : MAX_VIDEO_SIZE_BYTES;
    const limitMb = mediaType === MediaType.IMAGE ? MAX_IMAGE_SIZE_MB : MAX_VIDEO_SIZE_MB;
    const fileName = uploadFile.name;

    if(uploadFile.size > limitBytes){
        showToastMessage({
            toastType : 'alert',
            title : `${label} 용량 초과`,
            content : `${label} <b>${fileName}</b> 파일은 ${limitMb}MB 를 초과하여 업로드 할 수 없어요</br>${reason} 다시 시도해 주세요.`,
            delay : 12000
        });
        return false;
    }
    return true;
}