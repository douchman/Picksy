import {createdTopic} from "../../core/js/const/const.js";
import {createEntries} from "../../core/js/api/entry-edit-api.js";
import {EntryEditExceptionHandler} from "../../core/js/exception/entry-edit-exception-handler.js";
import {EntryCreateException} from "../../core/js/exception/EntryEditException.js";
import {buildValidatedEntryRegisterFormData} from "../../core/js/entry-form-data-builder.js";
import {
    addEntryFormEvents,
    addEntryZoneEvents
} from "../../core/js/entry-section/section-events.js";

const entryEditExceptionHandler = new EntryEditExceptionHandler();

export function setupEntrySection(){
    addEntrySectionEvents();
}

function addEntrySectionEvents(){
    addEntryZoneEvents(); // 엔트리 추가 버튼 이벤트
    addEntryFormEvents(); // 엔트리 등록 form 관련 이벤트
}

export async function registerEntries(){
    const {validationResult, formData : entryFormData } = await buildValidatedEntryRegisterFormData();

    if( !validationResult ){ return false;}
    if( !entryFormData ){ return true;}

    const entriesCreateResult = await createEntries(createdTopic.getId(), entryFormData);

    if( !entriesCreateResult ) { // 성공시 별도의 처리가 필요없으므로, 실패의 경우만 따짐
        entryEditExceptionHandler.handle(new EntryCreateException(entriesCreateResult.message, entriesCreateResult.status));
        return false;
    }

    return true;
}
