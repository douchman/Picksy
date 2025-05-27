import {topic} from "./const.js";
import {setupEntryStatisticsTable} from "./entry-statistics-table.js";
import {loadYoutubeIframeAPI, onYouTubeIframeApiReady} from "../../../global/js/youtube-iframe-api.js";
import {getTopicStatistics} from "./topic-statistics-api.js";


document.addEventListener('DOMContentLoaded', async () => {

    const topicIdSuccess = saveTopicId();

    if( topicIdSuccess ){
        const topicStatsSuccess = await renderTopicStatistics();
        loadYoutubeIframeAPI();
        onYouTubeIframeApiReady(async () => { // youtube API load success
            if(topicStatsSuccess) {
                await setupEntryStatisticsTable();
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
    try {
        const topicStatisticsResult = await getTopicStatistics(topic.getId());

        const topicDetail = topicStatisticsResult.topic;
        const topicStatistics = topicStatisticsResult.topicStatistics;

        renderTopicTitle(topicDetail.title);
        renderTotalMatches(topicStatistics.totalMatches);
    } catch(error){
      // TODO : handle getTopicStatistics API Exception
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
