import {topic, playRecord} from "./const.js";
import {showToastMessage} from "../../../global/popup/js/common-toast-message.js";
import {loadEntryMatchInfo} from "./entry-match.js";
import {loadYoutubeIframeAPI, onYouTubeIframeApiReady} from "../../../global/js/youtube-iframe-api.js";
import {getTopicDetail} from "./topic-play-api.js";

document.addEventListener('DOMContentLoaded', async () => {

    const topicSuccess  = await saveTopicInfo(); // 대결주제 식별자 변수화
    const playRecordSuccess = savePlayRecordInfo(); // 대결진행기록 식별자 변수화

    if( topicSuccess && playRecordSuccess){
        loadYoutubeIframeAPI();
    }

    // 유튜브 API 로드 후 호출되는 전역 함수
    onYouTubeIframeApiReady(async () =>{
        if( topicSuccess && playRecordSuccess){
            addTopicPlayEvents();
            await loadEntryMatchInfo();
        }
    });
});

function addTopicPlayEvents(){

    document.querySelector('#btn-back').addEventListener('click', () =>{
        location.href = '/';
    });
}

async function saveTopicInfo(){
    const path = window.location.pathname;
    const segments = path.split('/');
    const topicId = segments[segments.length - 1];

    topic.setId(topicId);

    const topicDetailResult = await getTopicDetail(topic.getId());
    if ( topicDetailResult ){
        topic.setTitle(topicDetailResult.topic.title);
        renderTopicTitle();
    } else {
        handleSetTopicFailed();
        return false;
    }

    return true;
}

function savePlayRecordInfo(){
    const storedPlayRecordIdName = `topic-${topic.getId()}-playRecord-id`;

    try {
        const playRecordId = localStorage.getItem(storedPlayRecordIdName);

        if( !playRecordId ){
            handleSetPlayRecordIdFailed();
        } else {
            playRecord.setId(playRecordId);
        }
    } catch(error) {
        handleSetPlayRecordIdFailed();
    } finally {
    }

    return true;
}

function renderTopicTitle(){
    document.querySelector('title').textContent = topic.getTitle();
    document.querySelector('#topic-title').textContent = topic.getTitle();
}

function handleSetPlayRecordIdFailed(){
    showToastMessage('대결 진행 정보를 확인할 수 없어요 :(' , 'error', 3500);
    setTimeout(()=> {
        location.href = '/';
    }, 2500);
}

function handleSetTopicFailed(){
    showToastMessage('대결 정보를 확인할 수 없어요 :(' , 'error', 3500);
    setTimeout(()=> {
        location.href = '/';
    }, 2500);
}
