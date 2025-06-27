import {buildValidatedEntryModifyPayload, buildValidatedEntryRegisterPayload} from "./entry-form-data-builder.js";
import {createEntries, getEntryList, modifyEntries} from "../api/entry-edit-api.js";
import {createdTopic} from "../const/const.js";
import {EntryEditExceptionHandler} from "../exception/entry-edit-exception-handler.js";

const entryEditExceptionHandler = new EntryEditExceptionHandler();

export async function registerEntries(){
    const {validationResult,  entryRegisterPayload } = await buildValidatedEntryRegisterPayload();

    if( !validationResult ){ return false;}
    if( !entryRegisterPayload ){ return true;}

    try {
        await createEntries(createdTopic.getId(), {entries : entryRegisterPayload});
    } catch (error) {
        entryEditExceptionHandler.handle(error, {context : 'entryCreate'});
        return false;
    }

    return true;
}

export async function updateEntries(){
    const {validationResult, entryModifyPayload} = await buildValidatedEntryModifyPayload();

    if( !validationResult ){ return false;}
    if( !entryModifyPayload) { return true;}

    try{
        await modifyEntries(createdTopic.getId(), {entriesToUpdate : entryModifyPayload});
    } catch (error) {
        entryEditExceptionHandler.handle(error, {context : 'entryModify'});
        return false;
    }

    return true;
}

export async function getExistEntries(){
    const entryListResult = await getEntryList(createdTopic.getId());

    try{
        return entryListResult.entries;
    } catch (error) {
        entryEditExceptionHandler.handle(error, {context : 'entryList'});
        return null;
    }
}