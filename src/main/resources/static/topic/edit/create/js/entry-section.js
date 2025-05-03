import {apiFormDataRequest} from "../../../../global/js/api.js";
import {getTopicId} from "./const.js";
import {showToastMessage} from "../../../../global/popup/js/common-toast-message.js";
import {handleEntryRegisterException} from "./exception.js";
import {addEntryAddEvent, entryFormEvents} from "./entry-create-event.js";
import {stagedEntryMedia} from "./staged-entry-media.js";

export function setupEntrySection(){
    addEntrySectionEvents();
}
function addEntrySectionEvents(){
    addEntryAddEvent(); // 엔트리 추가 버튼 이벤트
    entryFormEvents(); // 엔트리 등록 form 관련 이벤트
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

async function postEntries(requestBody){
    return apiFormDataRequest(`topics/${getTopicId()}/entries`, {}, requestBody);
}

function isEntryCreated(){
    const entryForm = document.querySelector('#entry-form');

    return entryForm.querySelector('.entry-item') !== null;
}
