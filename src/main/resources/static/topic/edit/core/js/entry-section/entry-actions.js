import {buildValidatedEntryModifyFormData, buildValidatedEntryRegisterFormData} from "./entry-form-data-builder.js";
import {createEntries, getEntryList, modifyEntries} from "../api/entry-edit-api.js";
import {createdTopic} from "../const/const.js";
import {EntryEditExceptionHandler} from "../exception/entry-edit-exception-handler.js";

const entryEditExceptionHandler = new EntryEditExceptionHandler();

export async function registerEntries(){
    const {validationResult, formData : entryFormData } = await buildValidatedEntryRegisterFormData();

    if( !validationResult ){ return false;}
    if( !entryFormData ){ return true;}

    try {
        await createEntries(createdTopic.getId(), entryFormData);
    } catch (error) {
        entryEditExceptionHandler.handle(error, {context : 'entryCrate'});
        return false;
    }

    return true;
}

export async function updateEntries(){
    const {validationResult, formData : entryFormData} = await buildValidatedEntryModifyFormData();

    if( !validationResult ){ return false;}
    if( !entryFormData) { return true;}

    try{
        await modifyEntries(createdTopic.getId(), entryFormData);
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