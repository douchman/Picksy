import {generateFilePreviewURL, generateVideoPreviewRL, getThumbFileFromVideoUrl} from "../../../../global/util/file.js";
import {generateRandomEntryId} from "../entry-uuid.js";
import {renderEntryItem} from "./entry-section/entry-renderer.js";
import {getThumbNailFileFromYoutubeUrl} from "../youtube.js";
import {MediaType} from "../../../../global/const/const.js";
import {initialEntryDataMap} from "./const/initial-entry-map.js";
import {showToastMessage} from "../../../../global/toast-message/js/common-toast-message.js";

const MAX_IMAGE_SIZE_MB = 2; // 업로드 가능 비디오 용량 2MB
const MAX_VIDEO_SIZE_MB = 3; // 업로드 가능 비디오 용량 4MB
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;
const MAX_VIDEO_SIZE_BYTES = MAX_VIDEO_SIZE_MB * 1024 * 1024;


export const stagedEntryMedia = {};

// 유튜브 링크 용 파일 스테이징
export async function addStagedEntryMediaForYoutube(media, entryId, imageUrl ){
    stagedEntryMedia[entryId] = {type : MediaType.YOUTUBE, media : media, thumbnail : await getThumbNailFileFromYoutubeUrl(imageUrl)};
    markInitialEntryDataAsChanged(entryId);
}

// 비어있는 값으로 스테이징
export function  addEmptyStagedEntryMedia(entryId){
    stagedEntryMedia[entryId] = {};
}

// 엔트리 아이템 랜더링과 함께 업로드 대기 파일 목록에 저장
export function addStagedEntryMediaWithRenderEntryItem(type, media, entryId = generateRandomEntryId()){
    const mediaType = getMediaMimeTypeFromUploadFile(media); // 추출된 mimeType 으로 분기

    if( !validateUploadFile(mediaType, media) ){ return; }

    stagedEntryMedia[entryId] = {type : mediaType, media : media};
    if ( mediaType === MediaType.IMAGE){ // 이미지 업로드
        generateFilePreviewURL(media, (url) =>{
            renderEntryItem(url, entryId, media.name, media.name);
            delete stagedEntryMedia[entryId].thumbnail; // 이미지는 thumbnail 필요 없음
        });
    } else { // 비디오 업로드
        generateVideoPreviewRL(media, (url) =>{
            renderEntryItem(url, entryId, media.name, media.name);
            stagedEntryMedia[entryId].thumbnail = getThumbFileFromVideoUrl(url); // 미리보기 이미지를 thumbNail 파일로 등록
        });
    }
}

// 엔트리 아이템 업데이트와 함께 업로드 대기 파일 목록에 저장
export function addStagedEntryMediaWithUpdateEntryItemThumb(type, media, entryId){


    const entryItem = document.getElementById(entryId);
    const entryThumb = entryItem.querySelector('.entry-thumb');
    const youtubeLink = entryItem.querySelector('.youtube-link');

    const mediaType = getMediaMimeTypeFromUploadFile(media); // 추출된 mimeType 으로 분기

    if( !validateUploadFile(mediaType, media) ){ return; }

    stagedEntryMedia[entryId] = {type : mediaType, media : media};

    if ( mediaType === MediaType.IMAGE){ // 이미지 업로드
        generateFilePreviewURL(media, (url) =>{
            entryThumb.style.backgroundImage = `url(${url})`;
            entryThumb.classList.remove('empty');
            youtubeLink.value = '';
            delete stagedEntryMedia[entryId].thumbnail; // 이미지는 thumbnail 필요 없음
        });
    } else { // 비디오 업로드
        generateVideoPreviewRL(media, (url) =>{
            entryThumb.style.backgroundImage = `url(${url})`;
            entryThumb.classList.remove('empty');
            youtubeLink.value = '';
            stagedEntryMedia[entryId].thumbnail = getThumbFileFromVideoUrl(url); // 미리보기 이미지를 thumbNail 파일로 등록
        });
    }

    markInitialEntryDataAsChanged(entryId)

}

// 업로드 된 파일로부터 mime type 확인
function getMediaMimeTypeFromUploadFile(file){
    if( file ){
        if (file.type.startsWith('image/')){
            return MediaType.IMAGE;
        } else if (file.type.startsWith('video/')){
            return MediaType.VIDEO;
        }
    }
}

export function removeStagedEntryMedia(fileId){
    delete stagedEntryMedia[fileId];
}

function markInitialEntryDataAsChanged(entryId){ // 수정을 위한 값이 존재 할 경우 modified flag 변경
    if( initialEntryDataMap.has(Number(entryId)) ){
        initialEntryDataMap.get(Number(entryId)).isMediaChanged = true;
    }
}

// 업로드 대상 파일 검사
function validateUploadFile(mediaType, uploadFile){
    const fileName = uploadFile.name;
    if(mediaType === MediaType.IMAGE){
        if(uploadFile.size > MAX_IMAGE_SIZE_BYTES){
            showToastMessage({
                toastType : 'alert',
                title : '이미지 용량 초과',
                content : `이미지 <b>${fileName}</b> 파일은 ${MAX_IMAGE_SIZE_MB}MB 를 초과하여 업로드 할 수 없어요</br>이미지 크기를 줄여 다시 시도해 주세요.`,
                delay : 10000
            });
            return false;
        }
    }

    else if(mediaType === MediaType.VIDEO){
        if(uploadFile.size > MAX_VIDEO_SIZE_BYTES){
            showToastMessage({
                toastType : 'alert',
                title : '비디오 용량 초과',
                content : `비디오 <b>${fileName}</b> 파일은 ${MAX_VIDEO_SIZE_MB}MB 를 초과하여 업로드 할 수 없어요</br>비디오 길이나 화질을 줄여 다시 시도해 주세요.`,
                delay : 10000
            });
            return false;
        }
    }
    return true;
}