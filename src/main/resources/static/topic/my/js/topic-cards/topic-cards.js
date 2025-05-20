import {setupInfiniteScrollObserver} from "./topic-cards-scroll-observer.js";
import {
    openTournamentSelectDialog,
    setupTournamentSelectDialog
} from "../../../../global/tounament-select-dialog/js/tournament-select-dialog.js";

const ACTION_HANDLERS = {
    play : openTournamentSelect,
    modify : moveToTopicModifyPage,
    stats : moveToTopicStatsPage
}

export function setupTopicCards(){
    setupInfiniteScrollObserver();
    setupTopicCardEvents();
    setupTournamentSelectDialog();
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

async function openTournamentSelect(topicId){
    await openTournamentSelectDialog(topicId);
}

function moveToTopicModifyPage(topicId){
    window.open(`/topic/modify/${topicId}`, '_blank'); // 새 탭으로 수정페이지 열기
}

function moveToTopicStatsPage(topicId){
    window.open(`/statistics/topic/${topicId}`, '_blank'); // 새 탭으로 수정페이지 열기
}