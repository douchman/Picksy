import {createdTopic} from "../../core/js/const/const.js";
import {
    addEmptyStagedEntryMedia,
} from "../../core/js/staged-entry-media.js";
import {renderExistEntryItem} from "../../core/entry-item-render.js";
import {createEntries, getEntryList, modifyEntries} from "../../core/js/api/entry-edit-api.js";
import {EntryEditExceptionHandler} from "../../core/js/exception/entry-edit-exception-handler.js";
import {
    EntryCreateException,
    EntryListException,
    EntryUpdateException
} from "../../core/js/exception/EntryEditException.js";
import {MediaType} from "../../../../global/js/const.js";
import {appendToInitialEntryDataMap} from "../../core/js/const/initial-entry-map.js";
import {
    buildValidatedEntryModifyFormData,
    buildValidatedEntryRegisterFormData
} from "../../core/js/entry-section/entry-form-data-builder.js";
import {addEntryFormEvents, addEntryZoneEvents} from "../../core/js/entry-section/section-events.js";

const entryEditExceptionHandler = new EntryEditExceptionHandler();

export async function setupEntrySection(){
    const existEntries = await getExistEntries();
    if( existEntries && existEntries.length > 0){
        renderEntries(existEntries);
        cacheInitialEntriesData(existEntries);
    }
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

    if( !entriesCreateResult ){ // 성공시 별도의 처리가 필요없으므로, 실패의 경우만 따짐
        entryEditExceptionHandler.handle(new EntryCreateException(entriesCreateResult.message, entriesCreateResult.status));
        return false;
    }

    return true;
}

export async function updateEntries(){
    const {validationResult, formData : entryFormData} = await buildValidatedEntryModifyFormData();

    if( !validationResult ){ return false;}
    if( !entryFormData) { return true;}

    const entriesUpdateResult = await modifyEntries(createdTopic.getId(), entryFormData);

    if( !entriesUpdateResult ){
        entryEditExceptionHandler.handle(new EntryUpdateException(entriesUpdateResult.message, entriesUpdateResult.status));
        return false;
    }

    return true;
}

// 기존 엔트리 랜더링
function renderEntries(existEntries){
    existEntries.forEach(entry => {
        const entryMediaType = entry.mediaType;
        const entryMediaUrl = entry.mediaUrl;
        const entryThumbnail =
            entryMediaType === MediaType.IMAGE ?
                entry.mediaUrl
                : entry.thumbnail;

        renderExistEntryItem(
            entryThumbnail,
            entry.id,
            entry.entryName,
            entry.description,
            `${entryMediaType === MediaType.YOUTUBE ? entryMediaUrl : ''}`);
    });
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

async function getExistEntries(){
    const entryListResult = await getEntryList(createdTopic.getId());

    if( entryListResult ){
        return entryListResult.entries;
    } else {
        entryEditExceptionHandler.handle(new EntryListException(entryListResult.message, entryListResult.status));
        return null;
    }
}