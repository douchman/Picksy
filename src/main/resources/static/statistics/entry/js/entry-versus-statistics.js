import { targetTopic, targetEntry } from "./const.js";

document.addEventListener('DOMContentLoaded', async () =>{
    if(saveTargetTopicIdAndEntryId()){

    }
});

/* 대결주제 및 엔트리 식별자 추출 & 저장 */
function saveTargetTopicIdAndEntryId(){
    const match = window.location.pathname.match(/\/topic\/(\d+)\/entry\/(\d+)/);

    if( match ) {
        targetTopic.id = match[1];
        targetEntry.id = match[2];
        return true;
    }

    return false;
}
