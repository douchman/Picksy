import {generateFilePreviewURL, generateVideoPreviewRL, getThumbFileFromVideoUrl} from "../../../../global/util/file.js";
import {generateRandomEntryId} from "../entry-uuid.js";
import {renderEntryItem} from "./entry-section/entry-renderer.js";
import {getThumbNailFileFromYoutubeUrl} from "../youtube.js";
import {MediaType} from "../../../../global/js/const.js";
import {initialEntryDataMap} from "./const/initial-entry-map.js";

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


    const mediaType = getMediaMimeTypeFromFromUploadFile(media); // 추출된 mimeType 으로 분기
    stagedEntryMedia[entryId] = {type : mediaType, media : media};
    if ( mediaType === MediaType.IMAGE){ // 이미지 업로드
        generateFilePreviewURL(media, (url) =>{
            renderEntryItem(url, entryId);
            delete stagedEntryMedia[entryId].thumbnail; // 이미지는 thumbnail 필요 없음
        });
    } else { // 비디오 업로드
        generateVideoPreviewRL(media, (url) =>{
            renderEntryItem(url, entryId);
            stagedEntryMedia[entryId].thumbnail = getThumbFileFromVideoUrl(url); // 미리보기 이미지를 thumbNail 파일로 등록
        });
    }
}

// 엔트리 아이템 업데이트와 함께 업로드 대기 파일 목록에 저장
export function addStagedEntryMediaWithUpdateEntryItemThumb(type, media, entryId){


    const entryItem = document.getElementById(entryId);
    const entryThumb = entryItem.querySelector('.entry-thumb');
    const youtubeLink = entryItem.querySelector('.youtube-link');

    const mediaType = getMediaMimeTypeFromFromUploadFile(media); // 추출된 mimeType 으로 분기

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
function getMediaMimeTypeFromFromUploadFile(file){
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