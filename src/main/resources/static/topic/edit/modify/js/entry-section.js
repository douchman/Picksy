import {apiFormDataRequest} from "../../../../global/js/api.js";
import {getTopicId} from "./const.js";
import {showToastMessage} from "../../../../global/popup/js/common-toast-message.js";
import {handleEntryRegisterException} from "./exception.js";
import {
    addStagedEntryMediaForYoutube,
    addStagedEntryMediaWithRenderEntryItem,
    addStagedEntryMediaWithUpdateEntryItemThumb, removeStagedEntryMedia,
    stagedEntryMedia
} from "./staged-entry-media.js";
import {renderEntryItem} from "../../core/entry-item-render.js";
import {generateRandomEntryId} from "../../core/entry-uuid.js";
import {getYouTubeInfoFromUrl} from "../../core/youtube.js";

let youtubeLinkDebounceTimer = null; // 유튜브 링크 디바운스 타이머

export function setupEntrySection(){
    addEntrySectionEvents();
}
function addEntrySectionEvents(){
    addEntryZoneEvents(); // 엔트리 추가 버튼 이벤트
    addEntryFormEvents(); // 엔트리 등록 form 관련 이벤트
}

export async function registerEntries(){
    let entryRegisterResult = true;
    if( isEntryCreated()){
        const {validationResult, formData : entryFormData } = await validateAndGenerateEntryFormData();

       if( validationResult ){
            const { status,isAuthOrNetworkError,  data : registerResult } = await postEntries(entryFormData);

            if( status !== 200){ // 성공시 별도의 처리가 필요없으므로, 실패의 경우만 따짐
                handleEntryRegisterException(isAuthOrNetworkError, registerResult);
                entryRegisterResult = false;
            }
        } else {
            entryRegisterResult = false;
        }
    }
    return entryRegisterResult;
}

async function validateAndGenerateEntryFormData(){
    const entryFormData = new FormData();
    const entryForm = document.querySelector('#entry-form');
    const entryItems = entryForm.querySelectorAll('.entry-item');

    entryFormData.append('topicId', getTopicId());

    for ( const [index, entryItem] of Array.from(entryItems).entries()){
        const entryItemId = entryItem.id;
        const entryName = entryItem.querySelector('.entry-name').value;
        const entryDescription = entryItem.querySelector('.entry-description').value;
        const entryMediaType = stagedEntryMedia[entryItemId].type;
        const entryMedia = stagedEntryMedia[entryItemId].media;
        const entryThumbnail = stagedEntryMedia[entryItemId].thumbnail;

        if(!entryMedia) {
            showToastMessage('이미지 또는 링크가 등록되지 않은 엔트리가 있어요', 'alert', 3000);
            return { validationResult : false, formData : {}};
        }

        entryFormData.append(`entries[${index}].entryName`, entryName);
        entryFormData.append(`entries[${index}].description`, entryDescription);
        if ( entryMediaType === 'file' ) { // 파일 업로드 방식 엔트리
            entryFormData.append(`entries[${index}].mediaFile`, entryMedia)
        } else { // 유튜브 링크 방식 엔트리
            entryFormData.append(`entries[${index}].mediaUrl`, entryMedia)
        }

        if( entryThumbnail ){
            entryFormData.append(`entries[${index}].thumbnailFile`, entryThumbnail)
        }

    }

    return { validationResult : true, formData : entryFormData };

}

// 엔트리 추가 버튼 이벤트 등록
function addEntryZoneEvents(){

    // 클릭 -> 빈 엔트리 슬롯
    document.querySelector('#entry-add-zone').addEventListener('click', function(){
        renderEntryItem(null);
    });

    // 드래그 & 드롭 이벤트 처리
    document.querySelector('#entry-add-zone').addEventListener('dragover', function(e){
        e.preventDefault();
        this.classList.add('drag-over');
    });
    document.querySelector('#entry-add-zone').addEventListener('dragleave', function(e){
        e.preventDefault();
        this.classList.remove('drag-over');
    });

    // 드래그 & 드롭 으로 엔트리 등록
    document.querySelector('#entry-add-zone').addEventListener('drop', function(e){
        e.preventDefault();

        const files = e.dataTransfer.files;

        requestAnimationFrame(() => {
            for(const file of files){
                const entryId = generateRandomEntryId();
                addStagedEntryMediaWithRenderEntryItem('file', file, entryId);
            }
        });

        this.classList.remove('drag-over');
    });
}

// 엔트리 등록 form 내 이벤트 등록
function addEntryFormEvents(){
    entryThumbClickEvent(); // 썸네일 영역 클릭 이벤트
    entryThumbChangeEvent(); // 썸네일 변경 이벤트
    entryYouTubeLinkEvent(); // 유튜브 링크 입력 란 이벤트
}

// 엔트리 등록 슬롯 -> 썸네일 영역 클릭 이벤트
function entryThumbClickEvent(){
    document.querySelector('#entry-form').addEventListener('click', function(event){
        const eventTarget = event.target;

        const handlers = {
            'btn-remove-entry' : removeEntryItem,
            'entry-thumb' : triggerEntryThumbUpload,
        }

        for (const key in handlers) {
            if (eventTarget.matches(`.${key}`)) {
                handlers[key](eventTarget);
                return;
            }
        }
    });
}

// 엔트리 등록 슬롯 -> 썸네일 변경 이벤트
function entryThumbChangeEvent(){
    document.querySelector('#entry-form').addEventListener('change', function(event){
        const eventTarget = event.target;

        if (eventTarget.matches('.entry-thumb-upload')) {
            updateEntryThumb(eventTarget);
        }
    });
}

// 엔트리 등록 슬롯 -> 유튜브 링크 입력란 이벤트
function entryYouTubeLinkEvent(){
    document.querySelector('#entry-form').addEventListener('input', async function(event){
        const eventTarget = event.target;

        if (eventTarget.matches('.youtube-link')) {
            getThumbnailFromYoutubeLink(eventTarget);
        }
    });

    document.querySelector('#entry-form').addEventListener('paste', async function(event){
        const eventTarget = event.target;

        if (eventTarget.matches('.youtube-link')) {
            getThumbnailFromYoutubeLink(eventTarget);
        }
    });
}

// 엔트리 썸네일 업데이트
function updateEntryThumb(entryThumbUpload){
    const entryItem = entryThumbUpload.closest('.entry-item');
    const entryId = entryItem.id;
    const file = entryThumbUpload.files[0];
    addStagedEntryMediaWithUpdateEntryItemThumb('file', file, entryId);
}

// 생성한 엔트리 등록 슬롯 제거 -> stagedThumb 도 함께 삭제
function removeEntryItem(target){
    const entryItem = target.closest('.entry-item');
    if( entryItem ){
        const thumbId = entryItem.querySelector('.entry-thumb').id;
        entryItem.remove();
        thumbId && removeStagedEntryMedia(thumbId)
    }
}

// 엔트리 업로드 이벤트 호출을 위해 트리거
function triggerEntryThumbUpload(entryThumb){
    entryThumb.closest('.entry-item').querySelector('.entry-thumb-upload').click();
}

// 입력된 유튜브 링크로부터 썸네일 조회
function getThumbnailFromYoutubeLink(youtubeLinkInput){
    const entryId = youtubeLinkInput.closest('.entry-item').id;
    const entryThumb = youtubeLinkInput.closest('.entry-item').querySelector('.entry-thumb');
    const url = youtubeLinkInput.value;

    clearTimeout(youtubeLinkDebounceTimer);
    youtubeLinkDebounceTimer = setTimeout( async () => { // 일정시간 지연 후 동작
        const {result, message, thumbNail} = await getYouTubeInfoFromUrl(url);

        if( result ){
            entryThumb.style.backgroundImage = `url(${thumbNail})`;
            entryThumb.classList.add('youtube');
            entryThumb.classList.remove('empty');
            await addStagedEntryMediaForYoutube('youtube', url, entryId, thumbNail );
        } else {
            showToastMessage(`${message}`, 'error', 2500);
            entryThumb.style.backgroundImage = '';
            entryThumb.classList.add('empty');
            entryThumb.classList.remove('youtube');
        }
    }, 300);
}

async function postEntries(requestBody){
    return apiFormDataRequest(`topics/${getTopicId()}/entries`, {}, requestBody);
}

function isEntryCreated(){
    const entryForm = document.querySelector('#entry-form');

    return entryForm.querySelector('.entry-item') !== null;
}
