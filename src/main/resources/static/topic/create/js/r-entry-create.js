import {generateFilePreviewURL} from "../../../global/js/file.js";
import {apiFormDataRequest} from "../../../global/js/api.js";
import {getTopicId} from "./const.js";

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
            'btn-remove-entry' : removeEntryItem
        }

        for (const key in handlers) {
            if (eventTarget.matches(`.${key}`)) {
                handlers[key](eventTarget);
                return;
            }
        }
    });
}

function renderEntryItem(thumbnail, entryId = generateEntryId()){
    const entryForm = document.querySelector('#entry-form');
    const entryItem =
        `<div class="entry-item" id="${entryId}">
            <div class="entry-thumb" ${thumbnail ? `style="background-image : url(${thumbnail})"` : ''}></div>
                <div class="entry-desc">
                    <div class="entry-desc-input-group">
                        <span class="input-index">엔트리 명</span>
                        <input class="entry-name" type="text" maxlength="30">
                    </div>
                     <div class="entry-desc-input-group">
                         <span class="input-index">엔트리 설명</span>
                         <input class="entry-desc" type="text" maxlength="200">
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

function addFileToStagedEntryThumbFiles(file){
    const entryId = generateEntryId();
    stagedEntryThumbFiles[entryId] = file;

    generateFilePreviewURL(file, (url) =>{
        renderEntryItem(url, entryId);
    });
}

function removeStagedEntryThumbFiles(fileId){
    delete stagedEntryThumbFiles[fileId];
}

export async function registerEntries(){
    if( isEntryCreated()){
        const {validationResult, formData : entryFormData } = await validateAndGenerateEntryFormData();

        if( validationResult ){
            const { status, data : registerResult } = await postEntries(entryFormData);

            if( status === 200){
                return true;
            } else {
                return false;
            }
        }
    } else {
        return true;
    }
}

async function validateAndGenerateEntryFormData(){
    const entryFormData = new FormData();
    const entryForm = document.querySelector('#entry-form');
    const entryItems = entryForm.querySelectorAll('.entry-item');

    entryFormData.append('topicId', getTopicId());

    entryItems.forEach((entryItem, index) => {
        const entryItemId = entryItem.id;
        const entryName = entryItem.querySelector('.entry-name').value;
        const entryDesc = entryItem.querySelector('.entry-desc').value;
        const entryThumbFile = stagedEntryThumbFiles[entryItemId]

        // TODO : 엔트리 아이템 유효성 검사 필요

        entryFormData.append(`entries[${index}].entryName`, entryName)
        entryFormData.append(`entries[${index}].description`, entryDesc)
        entryFormData.append(`entries[${index}].file`, entryThumbFile)

    });

    return { validationResult : true, formData : entryFormData };

}

async function postEntries(requestBody){
    return apiFormDataRequest(`topics/${getTopicId()}/entries`, {}, requestBody);
}

function isEntryCreated(){
    const entryForm = document.querySelector('#entry-form');

    return entryForm.querySelector('.entry-item') !== null;
}