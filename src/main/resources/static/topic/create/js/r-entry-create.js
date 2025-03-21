import {generateFilePreviewURL} from "../../../global/js/file.js";

export function addEntryCreateEvents(){

    document.querySelector('#add-entry').addEventListener('click', function(){
        renderEmptyEntryItem();
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
        const dataTransfer = new DataTransfer();
        const files = e.dataTransfer.files;
        const entryFile = document.querySelector('#entry-image');

        for(const file of files){
            dataTransfer.items.add(file);
        }

        entryFile.files = dataTransfer.files;

        requestAnimationFrame(() => {
            Array.from(entryFile.files).forEach(file => {
                generateFilePreviewURL(file, (url) =>{
                    renderEmptyEntryItem(url);
                })
            });
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

function renderEmptyEntryItem(thumbnail){
    const entryForm = document.querySelector('#entry-form');
    const entryItem =
        `<div class="entry-item">
            <div class="entry-thumb" style="background-image: url(${thumbnail})"></div>
                <div class="entry-desc">
                    <div class="entry-desc-input-group">
                        <span class="input-index">엔트리 명</span>
                        <input class="entry-name" type="text">
                    </div>
                     <div class="entry-desc-input-group">
                         <span class="input-index">엔트리 설명</span>
                         <input class="entry-desc" type="text">
                     </div>
                </div>
                <button class="btn-remove-entry"></button>
        </div>`;

    entryForm.insertAdjacentHTML('beforeend', entryItem);
}

function removeEntryItem(target){
    const entryItem = target.closest('.entry-item');
    if( entryItem ){
        entryItem.remove();
    }
}