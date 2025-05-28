import {setupInfiniteScrollObserver} from "./topic-cards-scroll-observer.js";
import {shareTopic} from "../../../../global/util/share.js";

const ACTION_HANDLERS = {
    play : moveToTopicPlay,
    modify : moveToTopicModifyPage,
    stats : moveToTopicStatsPage,
    share : shareMyTopic
}

export function setupTopicCards(){
    setupInfiniteScrollObserver();
    setupTopicCardEvents();
}

function setupTopicCardEvents(){
    addTopicCardClickEvent();
}

// 대결주제 카드 클릭 -> 요소에 따라 이벤트 위임
function addTopicCardClickEvent(){
    document.querySelector('#topic-cards').addEventListener('click', (e) => {
        const actionTarget = e.target.closest('[data-action]');
        if(!actionTarget) return;

        const action = actionTarget.dataset.action;
        const handler = ACTION_HANDLERS[action];

        if( handler ) {
            const topicCard = actionTarget.closest('.topic-card');
            const topicId = topicCard?.id;
            if( topicId ) { handler(topicId); }
        }
    });
}

async function moveToTopicPlay(topicId){
    window.open(`/topic/play/${topicId}`, '_blank'); // 대결진행 페이지 이동(새 탭 열기)
}

function moveToTopicModifyPage(topicId){
    window.open(`/topic/modify/${topicId}`, '_blank'); // 새 탭으로 수정페이지 열기
}

function shareMyTopic(topicId){
    shareTopic(topicId)
}

function moveToTopicStatsPage(topicId){
    window.open(`/statistics/topic/${topicId}`, '_blank'); // 새 탭으로 수정페이지 열기
}