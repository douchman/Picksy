import {generateFilePreviewURL} from "../../../global/js/file.js";
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
