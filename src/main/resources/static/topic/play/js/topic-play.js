import {topic} from "./const.js";
import {loadYoutubeIframeAPI, onYouTubeIframeApiReady} from "../../../global/js/youtube-iframe-api.js";
import {getTopicDetail} from "./topic-play-api.js";
import {TopicPlayExceptionHandler} from "./exception/topic-play-exception-handler.js";
import { SetTopicInfoException} from "./exception/TopicPlayException.js";
import {
    openTournamentSelectDialog,
    setupTournamentSelectDialog
} from "../tounament-select-dialog/js/tournament-select-dialog.js";

const topicPlayExceptionHandler = new TopicPlayExceptionHandler();

document.addEventListener('DOMContentLoaded', async () => {

    const topicSuccess  = await saveTopicInfo(); // 대결주제 식별자 변수화

    if( topicSuccess ){
        setupTournamentSelectDialog();
        loadYoutubeIframeAPI();
    }

    // 유튜브 API 로드 후 호출되는 전역 함수
    onYouTubeIframeApiReady(async () =>{
        await openTournamentSelectDialog(topic.getId());
        addTopicPlayEvents();
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
        topicPlayExceptionHandler.handle(new SetTopicInfoException(topicDetailResult.message));
        return false;
    }

    return true;
}

function renderTopicTitle(){
    document.querySelector('title').textContent = topic.getTitle();
    document.querySelector('#topic-title').textContent = topic.getTitle();
}
