import {stagedEntryMedia} from "../staged-entry-media.js";
import {showToastMessage} from "../../../../../global/toast-message/js/common-toast-message.js";
import {initialEntryDataMap, isModifiedEntry} from "../const/initial-entry-map.js";
import {MediaType} from "../../../../../global/const/const.js";
import {uploadEntriesMedia} from "./entry-media-uploader.js";

// 신규 등록 엔트리 form 데이터 검사 및 생성
export async function buildValidatedEntryRegisterPayload(){
    const entryRegisterPayload = [];
    const entryForm = document.querySelector('#entry-form');
    const registerEntryItems = entryForm.querySelectorAll('.entry-item:not(.modify-entry)');

    // 등록 대상 존재 확인
    if(isRegisterEntryItemsEmpty(registerEntryItems)) return { validationResult : true, entryRegisterPayload : null };

    // 입력 값 검사
    if(!validatedEntryRegisterForm()) return { validationResult : false, entryRegisterPayload : null };

    const {uploadSuccess, groupedEntryMedia } = await uploadEntriesMedia();

    // 업로드 결과 확인
    if( !uploadSuccess) return { validationResult : false, entryRegisterPayload : null };

    for(const entryItem of registerEntryItems){
        const entryItemId = entryItem.id;
        const entryName = entryItem.querySelector('.entry-name').value;
        const entryDescription = entryItem.querySelector('.entry-description').value;
        const entryMediaType = groupedEntryMedia[entryItemId].mediaType;

        const updateEntry = {
            entryName : entryName,
            description : entryDescription,
            mediaType : entryMediaType
        }

        if( entryMediaType === MediaType.IMAGE){
            updateEntry.mediaUrl = groupedEntryMedia[entryItemId].image.objectKey;
        } else if( entryMediaType === MediaType.VIDEO){
            updateEntry.mediaUrl = groupedEntryMedia[entryItemId].video.objectKey;
            updateEntry.thumbnail = groupedEntryMedia[entryItemId].thumbnail.objectKey;
        } else if( entryMediaType === MediaType.YOUTUBE){
            updateEntry.mediaUrl = groupedEntryMedia[entryItemId].youtubeUrl;
            updateEntry.thumbnail = groupedEntryMedia[entryItemId].thumbnail.objectKey;
        }

        entryRegisterPayload.push(updateEntry);
    }

    return { validationResult : true, entryRegisterPayload };
}

// 업데이트 엔트리 form 데이터 검사 및 생성
export async function buildValidatedEntryModifyPayload(){
    const entryModifyPayload = [];
    const entryForm = document.querySelector('#entry-form');
    const entryModifyItems = entryForm.querySelectorAll('.entry-item.modify-entry');

    const {uploadSuccess, groupedEntryMedia } = await uploadEntriesMedia();

    if(!uploadSuccess) return { validationResult : false, entryModifyPayload : null };

    for( const entryItem of entryModifyItems) {
        const entryItemId = Number(entryItem.id);
        const entryName = entryItem.querySelector('.entry-name').value;
        const entryDescription = entryItem.querySelector('.entry-description').value;
        const entryMediaType = stagedEntryMedia[entryItemId].type;
        const isMediaChanged = initialEntryDataMap.get(entryItemId).isMediaChanged; // 미디어 변경 여부
        const isRemovedEntry = entryItem.classList.contains('removed');

        const currentData = {
            entryName : entryName,
            description : entryDescription
        }

        const modifyEntry = {
            id : entryItemId,
            delete : isRemovedEntry
        }

        if( !isRemovedEntry && isModifiedEntry(entryItemId, currentData)) {
            modifyEntry.entryName = entryName;
            modifyEntry.description = entryDescription;

            if( uploadSuccess && isMediaChanged){
                if( entryMediaType === MediaType.IMAGE){
                    modifyEntry.mediaUrl = groupedEntryMedia[entryItemId].image.objectKey;
                } else if( entryMediaType === MediaType.VIDEO){
                    modifyEntry.mediaUrl = groupedEntryMedia[entryItemId].video.objectKey
                    modifyEntry.thumbnail = groupedEntryMedia[entryItemId].thumbnail.objectKey
                } else if( entryMediaType === MediaType.YOUTUBE){
                    modifyEntry.mediaUrl = groupedEntryMedia[entryItemId].youtubeUrl;
                    modifyEntry.thumbnail = groupedEntryMedia[entryItemId].thumbnail.objectKey;
                }
                modifyEntry.mediaType = entryMediaType;
            }

        }
        entryModifyPayload.push(modifyEntry);
    }

    const isEntryModifyPayloadEmpty = entryModifyPayload.length === 0;

    if( isEntryModifyPayloadEmpty ) {
        return { validationResult : true, entryModifyPayload : null };
    }

    return { validationResult : true, entryModifyPayload };
}

function validatedEntryRegisterForm(){
    const entryForm = document.querySelector('#entry-form');
    const entryItems = entryForm.querySelectorAll('.entry-item:not(.modify-entry)');

    for ( const [, entryItem] of Array.from(entryItems).entries()){
        const entryItemId = entryItem.id;
        /*const entryName = entryItem.querySelector('.entry-name').value;
        const entryDescription = entryItem.querySelector('.entry-description').value;*/
        const entryMedia = stagedEntryMedia[entryItemId].media;

        if(!entryMedia) {
            showToastMessage('이미지 또는 링크가 등록되지 않은 엔트리가 있어요', 'alert', 3000);
            return false;
        }
    }
    return true;
}

// 등록 대상 엔트리 항목 존재 여부 검사
function isRegisterEntryItemsEmpty(registerEntryItems){
    return registerEntryItems.length === 0;
}
