import {
    addEmptyStagedEntryMedia,
} from "../../core/js/staged-entry-media.js";
import {renderExistingEntries} from "../../core/js/entry-section/entry-renderer.js";
import {appendToInitialEntryDataMap} from "../../core/js/const/initial-entry-map.js";
import {addEntryFormEvents, addEntryZoneEvents} from "../../core/js/entry-section/section-events.js";
import {getExistEntries} from "../../core/js/entry-section/entry-actions.js";

export async function setupEntrySection(){
    const existEntries = await getExistEntries();
    if( existEntries && existEntries.length > 0){
        renderExistingEntries(existEntries);
        cacheInitialEntriesData(existEntries);
    }
    addEntrySectionEvents();
}

function addEntrySectionEvents(){
    addEntryZoneEvents(); // 엔트리 추가 버튼 이벤트
    addEntryFormEvents(); // 엔트리 등록 form 관련 이벤트
}

// 기존 엔트리 조회 데이터 캐싱
function cacheInitialEntriesData(existEntries){
    existEntries.forEach(entry => {
        appendToInitialEntryDataMap(entry);
        addEmptyStagedEntryMedia(
            entry.id
            );
    });
}
