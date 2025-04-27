import { targetTopic, targetEntry } from "./const.js";
import {setupTargetEntry} from "./target-entry.js";
import {setupOpponentEntries} from "./opponent-entries.js";
import {loadYoutubeIframeAPI, onYouTubeIframeApiReady} from "../../../global/js/youtube-iframe-api.js";

document.addEventListener('DOMContentLoaded', async () =>{
    if(saveTargetTopicIdAndEntryId()){
        loadYoutubeIframeAPI();
        onYouTubeIframeApiReady(async () => {
            if(await setupTargetEntry()){
                await setupOpponentEntries();
            }
        });
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
