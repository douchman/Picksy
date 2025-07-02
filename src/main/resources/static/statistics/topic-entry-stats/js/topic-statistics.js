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

        console.log('topicStatistics -> ' , topicStatistics);
        renderTopicDetail(topicDetail);
        renderTopicStats(topicStatistics);
        renderTournamentStats(tournamentStatistics);
    } catch(error){
        topicStatisticsException.handle(error, {context : 'topicStatistics'});
        return false;
    }

    return true;
}

// 대결 주제 상세 정보 랜더링
function renderTopicDetail(topicDetail){
    if(topicDetail){
        document.querySelector('#topic-title').innerHTML = `${topicDetail.title}`;
        document.querySelector('#topic-description').innerHTML = `${topicDetail.description}`;
        document.querySelector('#topic-thumbnail').style.backgroundImage = `url('${topicDetail.thumbnail}')`;
    }
}

// 대결주제 통계 정보 랜더링
function renderTopicStats(topicStatistics){
    if(topicStatistics){
        document.querySelector('#total-matches').innerHTML = `${topicStatistics.totalMatches} 회`;

    }
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