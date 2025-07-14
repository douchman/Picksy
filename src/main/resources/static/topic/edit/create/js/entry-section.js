import {
    addEntryFormEvents,
    addEntryZoneEvents
} from "../../core/js/entry-section/section-events.js";
import {setupEntryGroupVerticalScroll} from "../../core/js/entry-section/entry-renderer.js";


export function setupEntrySection(){
    addEntrySectionEvents();
    setupEntryGroupVerticalScroll();
}

function addEntrySectionEvents(){
    addEntryZoneEvents(); // 엔트리 추가 버튼 이벤트
    addEntryFormEvents(); // 엔트리 등록 form 관련 이벤트
}
