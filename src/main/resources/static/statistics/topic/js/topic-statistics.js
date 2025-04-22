import {topic} from "./const.js";
import {apiGetRequest} from "../../../global/js/api.js";
import {setupEntryStatisticsTable} from "./entry-statistics-table.js";
import {renderEntryStatistics} from "./entry-statistics.js";
import {loadYoutubeIframeAPI, onYouTubeIframeApiReady} from "../../../global/js/youtube-iframe-api.js";
import {handleRenderTopicStatsException} from "./topic-statistics-exception-handler.js";


document.addEventListener('DOMContentLoaded', async () => {

    const topicIdSuccess = saveTopicId();

    if( topicIdSuccess ){
        const topicStatsSuccess = await renderTopicStatistics();
        const entriesStatsSuccess = await renderEntryStatistics();
        loadYoutubeIframeAPI();
        onYouTubeIframeApiReady(() => { // youtube API load success
            if(topicStatsSuccess && entriesStatsSuccess) {
                setupEntryStatisticsTable();
            }
        });
    }
});

// 대결주제 식별자 지역변수로 저장
function saveTopicId(){
    const path = window.location.pathname;
    const segments = path.split('/');
    const topicId = segments[segments.length - 1];

    if( !topicId ) {
        return false;
    }  else {
        topic.setId(topicId);
        return true;
    }
}

// 대결 주제 통계 랜더링
async function renderTopicStatistics(){
    const { status, isAuthOrNetworkError, data : topicStatisticsResult } = await getTopicStatistics();

    if( status === 200){
        const topic = topicStatisticsResult.topic;
        const topicStatistics = topicStatisticsResult.topicStatistics;
        renderTopicTitle(topic.title);
        renderTotalMatches(topicStatistics.totalMatches);
    } else {
        handleRenderTopicStatsException(isAuthOrNetworkError, topicStatisticsResult);
        return false;
    }

    return true;

}

// 대결 제목 랜더링
function renderTopicTitle(topicTitle){
    document.querySelector('#topic-title').innerHTML = `${topicTitle}`;
}

// 진행된 총 대결 횟수 랜더링
function renderTotalMatches(totalMatches){
    document.querySelector('#total-matches').innerHTML = `이 대결은 총<span>${totalMatches}번</span>플레이 되었어요!`;
}

// 대결 주제 통계 조회
async function getTopicStatistics(){
    return await apiGetRequest(`statistics/topics/${topic.getId()}`);
}