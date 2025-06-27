import {generateRandomEntryId} from "../../entry-uuid.js";
import {renderEntryItem} from "./entry-renderer.js";
import {
    addEmptyStagedEntryMedia, addStagedEntryMediaForYoutube,
    addStagedEntryMediaWithRenderEntryItem,
    addStagedEntryMediaWithUpdateEntryItemThumb, removeStagedEntryMedia
} from "../staged-entry-media.js";
import {getYouTubeInfoFromUrl} from "../../youtube.js";
import {showToastMessage} from "../../../../../global/toast-message/js/common-toast-message.js";
import {initialEntryDataMap} from "../const/initial-entry-map.js";
import {MediaType} from "../../../../../global/const/const.js";

let youtubeLinkDebounceTimer = null; // 유튜브 링크 디바운스 타이머

// 엔트리 추가 버튼 이벤트 등록
export function addEntryZoneEvents(){
    addEntryZoneDragAndDropEvent();
}

// 엔트리 등록 form 내 이벤트 등록
export function addEntryFormEvents(){
    entryThumbClickEvent(); // 썸네일 영역 클릭 이벤트
    entryThumbChangeEvent(); // 썸네일 변경 이벤트
    entryYouTubeLinkEvent(); // 유튜브 링크 입력 란 이벤트
}

// 엔트리 등록 영역 drag & drop 이벤트
function addEntryZoneDragAndDropEvent(){

    // 클릭 -> 빈 엔트리 슬롯
    document.querySelector('#entry-add-zone').addEventListener('click', function(){
        const entryId = generateRandomEntryId();
        renderEntryItem(null, entryId);
        addEmptyStagedEntryMedia(entryId)
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

// 엔트리 등록 슬롯 -> 썸네일 영역 클릭 이벤트
function entryThumbClickEvent(){
    document.querySelector('#entry-form').addEventListener('click', function(event){
        const eventTarget = event.target;

        const handlers = {
            'btn-remove-entry' : removeEntryItem,
            'btn-restore-entry' : restoreEntryItem,
            'entry-thumb' : triggerEntryThumbUpload,
            'mask-removed' : cancelRemoved,
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
    if(file){
        addStagedEntryMediaWithUpdateEntryItemThumb('file', file, entryId);
    }
}

// 생성한 엔트리 등록 슬롯 제거 -> stagedThumb 도 함께 삭제
function removeEntryItem(target){
    const entryItem = target.closest('.entry-item');
    if( entryItem ){
        const isModifyEntry = entryItem.classList.contains('modify-entry');
        if( isModifyEntry ) { // 수정 대상 엔트리 삭제
            entryItem.classList.add('removed');
        } else { // 신규 추가 대상 엔트리의 삭제
            const thumbId = entryItem.querySelector('.entry-thumb').id;
            entryItem.remove();
            thumbId && removeStagedEntryMedia(thumbId)
        }

    }
}

// 생성한 엔트리 입력사항 되돌리기
function restoreEntryItem(target){
    const entryItem = target.closest('.entry-item');
    if(entryItem){
        const initialEntryData = initialEntryDataMap.get(Number(entryItem.id));
        const entryMediaType = initialEntryData.mediaType;
        const entryName = entryItem.querySelector('.entry-name');
        const entryDescription = entryItem.querySelector('.entry-description');
        const entryThumb = entryItem.querySelector('.entry-thumb');
        const youTubeLink = entryItem.querySelector('.youtube-link');

        switch(entryMediaType) {
            case MediaType.IMAGE:
                entryThumb.style.backgroundImage = 'url(' + initialEntryData.mediaUrl + ')';
                youTubeLink.value = '';
                break;
            case MediaType.VIDEO:
                entryThumb.style.backgroundImage = 'url(' + initialEntryData.thumbnail + ')';
                youTubeLink.value = '';
                break;
            case MediaType.YOUTUBE:
                entryThumb.style.backgroundImage = 'url(' + initialEntryData.thumbnail + ')';
                youTubeLink.value = initialEntryData.mediaUrl;
                break;
        }

        entryThumb.classList.remove('empty');
        entryName.value = initialEntryData.entryName;
        entryDescription.value = initialEntryData.description;

        initialEntryData.isMediaChanged = false;
    }
}

// 엔트리 업로드 이벤트 호출을 위해 트리거
function triggerEntryThumbUpload(entryThumb){
    entryThumb.closest('.entry-item').querySelector('.entry-thumb-upload').click();
}

// 수정 대상 엔트리 삭제대상 복구
function cancelRemoved(target){
    const entryItem = target.closest('.entry-item');
    if(entryItem && entryItem.classList.contains('removed')){
        entryItem.classList.remove('removed');
    }
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
            await addStagedEntryMediaForYoutube(url, entryId, thumbNail );
        } else {
            showToastMessage(`${message}`, 'error', 2500);
            entryThumb.style.backgroundImage = '';
            entryThumb.classList.add('empty');
            entryThumb.classList.remove('youtube');
        }
    }, 300);
}
