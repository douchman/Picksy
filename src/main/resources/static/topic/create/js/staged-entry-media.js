import {generateFilePreviewURL} from "../../../global/js/file.js";
import {generateRandomEntryId} from "./util.js";

export const stagedEntryMedia = {};

export function addStagedEntryMedia(type, media, entryId = generateRandomEntryId(), callBackFunc){

    stagedEntryMedia[entryId] = {type : type, media : media};

    if( type ==='file' && callBackFunc ){
        generateFilePreviewURL(media, (url) =>{
            if(typeof callBackFunc === 'function'){
                callBackFunc(url, entryId);
            }
        });
    }
}


export function removeStagedEntryMedia(fileId){
    delete stagedEntryMedia[fileId];
}
