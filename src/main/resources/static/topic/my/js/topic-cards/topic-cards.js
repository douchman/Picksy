import {setupInfiniteScrollObserver} from "./topic-cards-scroll-observer.js";
import {shareTopic} from "../../../../global/util/share.js";
import {ModerationStatus} from "../../../../global/const/const.js";
import {showToastMessage} from "../../../../global/toast-message/js/common-toast-message.js";

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
            if( topicId ) { handler(topicId, topicCard); }
        }
    });
}

async function moveToTopicPlay(topicId, topicCard){
    if(validateTopicModerationStatus(topicCard.dataset.moderation)){
        window.open(`/topic/play/${topicId}`, '_blank') //대결진행 페이지 이동(새 탭 열기)
    }
}

function moveToTopicModifyPage(topicId){
    location.href =  `/topic/modify/${topicId}`;
}

function shareMyTopic(topicId, topicCard){
    if(validateTopicModerationStatus(topicCard.dataset.moderation)){
        shareTopic(topicId)
    }
}

function moveToTopicStatsPage(topicId, topicCard){
    if(validateTopicModerationStatus(topicCard.dataset.moderation)){
        location.href =  `/statistics/topic/${topicId}`;
    }
}

function validateTopicModerationStatus(moderationStatus){
    const isModerationPassed = ModerationStatus.PASSED === moderationStatus;

    if( !isModerationPassed ) {
        showToastMessage({
            toastType: 'alert',
            title : '제한된 표현이 포함된 대결',
            content : '제한된 표현이 포함된 대결이에요. 내용을 수정하고 이용해주세요'
        });
    }
    return isModerationPassed;
}