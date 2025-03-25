import {generateFilePreviewURL} from "../../../global/js/file.js";
import {apiFormDataRequest} from "../../../global/js/api.js";
import {getTopicId} from "./const.js";
import {showToastMessage} from "../../../global/popup/js/common-toast-message.js";

const stagedEntryThumbFiles = {};

export function addEntryCreateEvents(){

    document.querySelector('#add-entry').addEventListener('click', function(){
        renderEntryItem();
    });
    document.querySelector('#add-entry').addEventListener('dragover', function(e){
        e.preventDefault();
        this.classList.add('drag-over');
    });
    document.querySelector('#add-entry').addEventListener('dragleave', function(e){
        e.preventDefault();
        this.classList.remove('drag-over');
    });

    document.querySelector('#add-entry').addEventListener('drop', function(e){
        e.preventDefault();

        const files = e.dataTransfer.files;

        requestAnimationFrame(() => {
            for(const file of files){
                addFileToStagedEntryThumbFiles(file);
            }
        });

        this.classList.remove('drag-over');
    });

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

    document.querySelector('#entry-form').addEventListener('change', function(event){
        const eventTarget = event.target;

        if (eventTarget.matches('.entry-thumb-upload')) {
            updateEntryThumb(eventTarget);
        }
    });

}

function renderEntryItem(thumbnail, entryId = generateEntryId()){
    const entryForm = document.querySelector('#entry-form');
    const entryItem =
        `<div class="entry-item" id="${entryId}">
            <input class="entry-thumb-upload" type="file" accept="image/*">
            <div class="entry-thumb ${!thumbnail && `empty`}" ${thumbnail ? `style="background-image : url(${thumbnail})"` : ''}></div>
                <div class="entry-desc">
                    <div class="entry-desc-input-group">
                        <span class="input-index">엔트리 명</span>
                        <input class="entry-name" type="text" maxlength="30">
                    </div>
                     <div class="entry-desc-input-group">
                         <span class="input-index">엔트리 설명</span>
                         <input class="entry-description" type="text" maxlength="200">
                     </div>
                </div>
                <button class="btn-remove-entry"></button>
        </div>`;

    entryForm.insertAdjacentHTML('beforeend', entryItem);
}

function removeEntryItem(target){
    const entryItem = target.closest('.entry-item');
    if( entryItem ){
        const thumbId = entryItem.querySelector('.entry-thumb').id;
        entryItem.remove();
        thumbId && removeStagedEntryThumbFiles(thumbId)
    }
}

function generateEntryId(){
    return crypto.randomUUID();
}

function addFileToStagedEntryThumbFiles(file, entryId = generateEntryId(), isRender = true){
    stagedEntryThumbFiles[entryId] = file;

    if( isRender ){
        generateFilePreviewURL(file, (url) =>{
            renderEntryItem(url, entryId);
        });

    }
}

function removeStagedEntryThumbFiles(fileId){
    delete stagedEntryThumbFiles[fileId];
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
        const entryThumbFile = stagedEntryThumbFiles[entryItemId];

        if(!entryThumbFile) {
            showToastMessage('이미지가 등록되지 않은 엔트리가 있어요', 'alert', 3000);
            return { validationResult : false, formData : {}};
        }
        entryFormData.append(`entries[${index}].entryName`, entryName)
        entryFormData.append(`entries[${index}].description`, entryDescription)
        entryFormData.append(`entries[${index}].file`, entryThumbFile)

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

function handleEntryRegisterException(isAuthOrNetworkError, registerResult){
    if( !isAuthOrNetworkError ){
        showToastMessage(registerResult.message, 'error', 2000);
    }
}

function triggerEntryThumbUpload(entryThumb){
    entryThumb.closest('.entry-item').querySelector('.entry-thumb-upload').click();
}

function updateEntryThumb(entryThumbUpload){
    const entryItem = entryThumbUpload.closest('.entry-item');
    const tempEntryThumb = entryItem.querySelector('.entry-thumb');
    const entryId = entryItem.id;
    const file = entryThumbUpload.files[0];

    generateFilePreviewURL(file, (url) =>{
        if(url){
            tempEntryThumb.style.backgroundImage = `url(${url})`;
            tempEntryThumb.classList.remove('empty');
            addFileToStagedEntryThumbFiles(file, entryId, false);
        }
    });
}