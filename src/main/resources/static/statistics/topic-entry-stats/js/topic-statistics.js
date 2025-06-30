import {topic} from "./const.js";
import {setupEntryStatisticsTable} from "./entry-statistics-table/entry-statistics-table.js";
import {loadYoutubeIframeAPI, onYouTubeIframeApiReady} from "../../../global/youtube/youtube-iframe-api.js";
import {getTopicStatistics} from "./api/topic-statistics-api.js";
import {TopicStatisticsExceptionHandler} from "./exception/topic-statistics-exception-handler.js";

const topicStatisticsException = new TopicStatisticsExceptionHandler();

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
        const tournamentStatistics = topicStatisticsResult.tournamentStatistics;

        renderTopicThumbnail(topicDetail.thumbnail);
        renderTopicTitle(topicDetail.title);
        renderTopicDescription(topicDetail.description);
        renderTotalMatches(topicStatistics.totalMatches);
        renderTournamentStats(tournamentStatistics);
    } catch(error){
        topicStatisticsException.handle(error, {context : 'topicStatistics'});
        return false;
    }

    return true;
}

// 대결 주제 이미지 랜더링
function renderTopicThumbnail(thumbnail){
    document.querySelector('#topic-thumbnail').style.backgroundImage = `url('${thumbnail}')`;
}


// 대결 제목 랜더링
function renderTopicTitle(topicTitle){
    document.querySelector('#topic-title').innerHTML = `${topicTitle}`;
}

// 대결 설명 랜더링
function renderTopicDescription(topicDescription){
    document.querySelector('#topic-description').innerHTML = `${topicDescription}`;
}

// 진행된 총 대결 횟수 랜더링
function renderTotalMatches(totalMatches){
    document.querySelector('#total-matches').innerHTML = `${totalMatches} 회`;
}

// 가장 많이 선택 된 너먼트 랜더링
function renderTournamentStats(tournamentStatistics){
    if(tournamentStatistics && tournamentStatistics.length > 0){
        const mostPopularTournament = tournamentStatistics.reduce((max, current) => {
           return current.stageMatches > max.stageMatches ? current : max;
        });

        document.querySelector('#most-popular-tournament').innerHTML = `${mostPopularTournament.tournamentName}`;
    }

}