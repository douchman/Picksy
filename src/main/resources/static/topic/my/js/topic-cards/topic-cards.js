import {setupInfiniteScrollObserver} from "./topic-cards-scroll-observer.js";

export function setupTopicCards(){
    setupInfiniteScrollObserver();
    setupTopicCardEvents();
}

function setupTopicCardEvents(){
    // 대결주제 카드 -> 수정 버튼 이벤트
    document.querySelector('#topic-cards').addEventListener('click', (e) => {
        const modifyButton = e.target.closest('.btn-modify');
        if(modifyButton ){
            const topicCard = modifyButton.closest('.topic-card');
            moveToTopicModifyPage(topicCard)    ;
        }
    });
}

function moveToTopicModifyPage(topicCard){
    const topicId = topicCard.id;
    window.open(`/topic/modify/${topicId}`, '_blank'); // 새 탭으로 수정페이지 열기
}