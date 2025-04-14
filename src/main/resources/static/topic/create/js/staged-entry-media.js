import {generateFilePreviewURL} from "../../../global/js/file.js";
import {generateRandomEntryId} from "./util.js";
import {renderEntryItem} from "./entry-item-render.js";

export const stagedEntryMedia = {};

export function addStagedEntryMedia(type, media, entryId = generateRandomEntryId(), isRender = false){

    stagedEntryMedia[entryId] = {type : type, media : media};

    if( type ==='file' && isRender ){
        generateFilePreviewURL(media, (url) =>{
            renderEntryItem(url, entryId);
        });
    }
}


export function removeStagedEntryMedia(fileId){
    delete stagedEntryMedia[fileId];
}
