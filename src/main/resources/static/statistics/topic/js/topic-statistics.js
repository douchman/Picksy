import {topic} from "./const.js";
import {apiGetRequest} from "../../../global/js/api.js";
import {addEntryStatisticsTableEvents} from "./entry-statistics-table.js";
import {renderEntryStatistics} from "./entry-statistics.js";
import {renderPagination} from "./entry-statistics-table-pagination.js";
import {renderEntryMediaViewer} from "./entry-thumb-viewer.js";
import {loadYoutubeIframeAPI, onYouTubeIframeApiReady} from "../../../global/js/youtube-iframe-api.js";
import {addCommentsEvents, setupCommentInfiniteScrollObserver} from "./comment.js";


document.addEventListener('DOMContentLoaded', async () => {

    const topicIdSuccess = saveTopicId();

    if( topicIdSuccess ){
        const topicStatsSuccess = await renderTopicStatistics();
        const entriesStatsSuccess = await renderEntryStatistics();
        loadYoutubeIframeAPI();
        onYouTubeIframeApiReady(() => {
            if(topicStatsSuccess && entriesStatsSuccess) {
                renderPagination();
                renderEntryMediaViewer();
                addEntryStatisticsTableEvents();
                setupCommentInfiniteScrollObserver();
                addCommentsEvents();
            }
        });
    }
});

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

async function renderTopicStatistics(){
    const { status, data : {topic , topicStatistics} } = await getTopicStatistics();

    if( status === 200){
        renderTopicTitle(topic.title);
        renderTotalMatches(topicStatistics.totalMatches);
    } else {
        // TODO : api fail exception handle
        return false;
    }

    return true;

}

function renderTopicTitle(topicTitle){
    document.querySelector('#topic-title').innerHTML = `${topicTitle}`;
}

function renderTotalMatches(totalMatches){
    document.querySelector('#total-matches').innerHTML = `이 대결은 총<span>${totalMatches}번</span>플레이 되었어요!`;
}

async function getTopicStatistics(){
    return await apiGetRequest(`statistics/topics/${topic.getId()}`);
}