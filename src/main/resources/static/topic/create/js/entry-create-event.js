import {renderEntryItem} from "./entry-item-render.js";
import {generateRandomEntryId} from "./util.js";
import {addStagedEntryMedia} from "./staged-entry-media.js";

// 엔트리 추가 버튼 이벤트 등록
export function addAddEntryEvent(){

    // 클릭 -> 빈 엔트리 슬롯
    document.querySelector('#add-entry').addEventListener('click', function(){
        renderEntryItem(null);
    });

    // 드래그 & 드롭 이벤트 처리
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
                const entryId = generateRandomEntryId();
                addStagedEntryMedia('file', file, entryId, true);
            }
        });

        this.classList.remove('drag-over');
    });
}
