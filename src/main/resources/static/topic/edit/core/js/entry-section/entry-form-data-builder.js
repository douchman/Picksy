import {stagedEntryMedia} from "../staged-entry-media.js";
import {showToastMessage} from "../../../../../global/toast-message/js/common-toast-message.js";
import {initialEntryDataMap, isModifiedEntry} from "../const/initial-entry-map.js";
import {MediaType} from "../../../../../global/const/const.js";
import {uploadEntriesMedia} from "./entry-media-uploader.js";
import {
    entryDescValidationMessage, entryMediaValidationMessage,
    entryNameValidationMessage, isValidEntryMedia,
    validateEntryDescription,
    validateEntryName
} from "./entry-form-validator.js";

// 신규 등록 엔트리 form 데이터 검사 및 생성
export async function buildValidatedEntryRegisterPayload(){
    const entryRegisterPayload = [];
    const entryForm = document.querySelector('#entry-form');
    const registerEntryItems = entryForm.querySelectorAll('.entry-item:not(.modify-entry)');

    // 등록 대상 존재 확인
    if(isRegisterEntryItemsEmpty(registerEntryItems)) return { validationResult : true, entryRegisterPayload : null };

    // 입력 값 검사
    if(!validatedEntryRegisterPayload(registerEntryItems)) return { validationResult : false, entryRegisterPayload : null };

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
    const modifyEntryItems = entryForm.querySelectorAll('.entry-item.modify-entry');

    const {uploadSuccess, groupedEntryMedia } = await uploadEntriesMedia();

    // 수정 요청 payload 검사
    if(validateEntryModifyPayload(modifyEntryItems)) return { validationResult : false, entryRegisterPayload : null };

    // 업로드 결과 확인
    if(!uploadSuccess) return { validationResult : false, entryModifyPayload : null };

    for( const entryItem of modifyEntryItems) {
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

function validatedEntryRegisterPayload(registerEntryItems){
    for( const registerEntry of registerEntryItems ) {
        const entryItemId = registerEntry.id;
        const entryName = registerEntry.querySelector('.entry-name').value;
        const entryDescription = registerEntry.querySelector('.entry-description').value;
        const entryMedia = stagedEntryMedia[entryItemId].media;

        if(!validateEntryName(entryName)){
            showToastMessage(entryNameValidationMessage, 'alert', 2500);
            return false;
        }

        if(!validateEntryDescription(entryDescription)){
            showToastMessage(entryDescValidationMessage, 'alert', 2500);
            return false;
        }

        if(!isValidEntryMedia(entryMedia)) {
            showToastMessage(entryMediaValidationMessage, 'alert', 2500);
            return false;
        }
    }

    return true;
}

function validateEntryModifyPayload(modifyEntryItems){
    for( const modifyEntry of modifyEntryItems ){
        if(modifyEntry.classList.contains('removed')) continue; // 삭제 대상 엔트리일 경우 검증 제외

        const entryItemId = Number(modifyEntry.id);
        const entryName = modifyEntry.querySelector('.entry-name').value;
        const entryDescription = modifyEntry.querySelector('.entry-description').value;
        const isMediaChange = initialEntryDataMap.get(entryItemId).isMediaChanged;

        if(!validateEntryName(entryName)){
            showToastMessage(entryNameValidationMessage, 'alert', 2500);
            return false;
        }

        if(!validateEntryDescription(entryDescription)){
            showToastMessage(entryDescValidationMessage, 'alert', 2500);
            return false;
        }

        if(isMediaChange && !isValidEntryMedia(stagedEntryMedia[entryItemId].media)){
            showToastMessage(entryMediaValidationMessage, 'alert', 2500);
            return false;
        }
    }

    return true;
}

// 등록 대상 엔트리 항목 존재 여부 검사
function isRegisterEntryItemsEmpty(registerEntryItems){
    return registerEntryItems.length === 0;
}
