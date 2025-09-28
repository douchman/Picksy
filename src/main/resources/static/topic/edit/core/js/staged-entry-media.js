import {generateFilePreviewURL, generateVideoPreviewRL, getThumbFileFromVideoUrl} from "../../../../global/util/file.js";
import {generateRandomEntryId} from "../entry-uuid.js";
import {renderEntryItem} from "./entry-section/entry-renderer.js";
import {getThumbNailFileFromYoutubeUrl} from "../youtube.js";
import {MediaType} from "../../../../global/const/const.js";
import {initialEntryDataMap} from "./const/initial-entry-map.js";
import {checkTotalUploadSize, validateUploadFile} from "./entry-section/entry-media-validate.js";

export const stagedEntryMedia = new Proxy({} , {
    set(target, key, value) {
        target[key] = value;
        checkTotalUploadSize();
        return true;
    }
});

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

    const tempEntryName = extractFileNameWithoutExtension(media);
    if ( mediaType === MediaType.IMAGE){ // 이미지 업로드
        generateFilePreviewURL(media, (url) =>{
            renderEntryItem(url, entryId, tempEntryName, tempEntryName);
            delete stagedEntryMedia[entryId].thumbnail; // 이미지는 thumbnail 필요 없음
        });
    } else { // 비디오 업로드
        generateVideoPreviewRL(media, (url) =>{
            renderEntryItem(url, entryId, tempEntryName, tempEntryName);
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

// 원본 파일명 확장자 제거 후 반환 : 엔트리 등록 시 자동 기입
function extractFileNameWithoutExtension(media){
    if(!media) return "";

    const fileName = media.name.split(/[/\\]/).pop(); // 혹시 모를 포함된 경로 제거
    const lastDotIdx = fileName.lastIndexOf('.');

    if( lastDotIdx === -1) return fileName; // 확장자 없음 -> 그대로 반환

    if(lastDotIdx === 0) return fileName; // 숨김 파일 -> 그대로 반환

    return fileName.substring(0, lastDotIdx);
}

