export function addEntryCreateEvents(){

    document.querySelector('#add-entry').addEventListener('click', function(){
        renderEmptyEntryItem();
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

function renderEmptyEntryItem(){
    const entryForm = document.querySelector('#entry-form');
    const entryItem =
        `<div class="entry-item">
            <div class="entry-thumb"></div>
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