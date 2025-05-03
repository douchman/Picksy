import {generateFilePreviewURL, generateVideoPreviewRL, getThumbFileFromVideoUrl} from "../../../global/js/file.js";
import {generateRandomEntryId} from "../../common/util/entry-uuid.js";
import {renderEntryItem} from "./entry-item-render.js";
import {getThumbNailFileFromYoutubeUrl} from "../../common/util/youtube.js";

export const stagedEntryMedia = {};

// 유튜브 링크 용 파일 스테이징
export async function addStagedEntryMediaForYoutube(type, media, entryId, imageUrl ){
    stagedEntryMedia[entryId] = {type : type, media : media, thumbnail : await getThumbNailFileFromYoutubeUrl(imageUrl)};
}

// 엔트리 아이템 랜더링과 함께 업로드 대기 파일 목록에 저장
export function addStagedEntryMediaWithRenderEntryItem(type, media, entryId = generateRandomEntryId()){

    stagedEntryMedia[entryId] = {type : type, media : media};

    if( type ==='file'){
        const mediaType = getMediaMimeTypeFromFromUploadFile(media); // 추출된 mimeType 으로 분기
        if ( mediaType === 'IMAGE'){ // 이미지 업로드
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
}

// 엔르티 아이템 업데이트와 함께 업로드 대기 파일 목록에 저장
export function addStagedEntryMediaWithUpdateEntryItemThumb(type, media, entryId){

    stagedEntryMedia[entryId] = {type : type, media : media};
    const entryItem = document.getElementById(entryId);
    const entryThumb = entryItem.querySelector('.entry-thumb');
    const youtubeLink = entryItem.querySelector('.youtube-link');

    if( type ==='file'){
        const mediaType = getMediaMimeTypeFromFromUploadFile(media); // 추출된 mimeType 으로 분기
        if ( mediaType === 'IMAGE'){ // 이미지 업로드
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
    }
}


// 업로드 된 파일로부터 mime type 확인
function getMediaMimeTypeFromFromUploadFile(file){
    if( file ){
        if (file.type.startsWith('image/')){
            return "IMAGE";
        } else if (file.type.startsWith('video/')){
            return "VIDEO"
        }
    }
}

export function removeStagedEntryMedia(fileId){
    delete stagedEntryMedia[fileId];
}
