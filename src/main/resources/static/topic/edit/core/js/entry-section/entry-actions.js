import {buildValidatedEntryModifyFormData, buildValidatedEntryRegisterFormData} from "./entry-form-data-builder.js";
import {createEntries, getEntryList, modifyEntries} from "../api/entry-edit-api.js";
import {createdTopic} from "../const/const.js";
import {EntryCreateException, EntryListException, EntryUpdateException} from "../exception/EntryEditException.js";
import {EntryEditExceptionHandler} from "../exception/entry-edit-exception-handler.js";

const entryEditExceptionHandler = new EntryEditExceptionHandler();

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

export async function getExistEntries(){
    const entryListResult = await getEntryList(createdTopic.getId());

    if( entryListResult ){
        return entryListResult.entries;
    } else {
        entryEditExceptionHandler.handle(new EntryListException(entryListResult.message, entryListResult.status));
        return null;
    }
}