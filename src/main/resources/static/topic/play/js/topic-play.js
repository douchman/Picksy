import {playRecordStorage, topic} from "./const.js";
import {loadYoutubeIframeAPI, onYouTubeIframeApiReady} from "../../../global/youtube/youtube-iframe-api.js";
import {getTopicDetail} from "./topic-play-api.js";
import {TopicPlayExceptionHandler} from "./exception/topic-play-exception-handler.js";
import {
    openTournamentSelectDialog,
    setupTournamentSelectDialog
} from "../tounament-select-dialog/js/tournament-select-dialog.js";
import {loadEntryMatchInfo} from "./entry-match.js";

const topicPlayExceptionHandler = new TopicPlayExceptionHandler();

document.addEventListener('DOMContentLoaded', async () => {

    const topicSuccess  = await saveTopicInfo(); // 대결주제 식별자 변수화

    if( topicSuccess ){
        setupTournamentSelectDialog();
        loadYoutubeIframeAPI();
    }

    // 유튜브 API 로드 후 호출되는 전역 함수
    onYouTubeIframeApiReady(async () =>{
        addTopicPlayEvents();
        if(!playRecordStorage.exists()){ // 저장된 식별자 존재여부 확인
            await openTournamentSelectDialog(topic.getId());
        } else{ // 이미 저장된 식별자 존재 시 바로 매치업 조회
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

    try{
        const topicDetailResult = await getTopicDetail(topic.getId());
        topic.setTitle(topicDetailResult.topic.title);
        renderTopicTitle();
    } catch (error){
        topicPlayExceptionHandler.handle(error, {context : 'topicDetail'});
        return false;
    }

    return true;
}

function renderTopicTitle(){
    document.querySelector('title').textContent = topic.getTitle();
    document.querySelector('#topic-title').textContent = topic.getTitle();
}
