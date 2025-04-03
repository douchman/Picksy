import {apiGetRequest} from '../../global/js/api.js';
import {addDialogEvents, renderDialog, openTournamentSelectDialog} from "./tournament-select-dialog.js";
import {flushPlayRecordIdsFromLocalStorage} from "../../global/js/vstopic-localstorage.js";

let scrollObserver;

document.addEventListener('DOMContentLoaded', async () => {
    initObserver();
    flushPlayRecordIdsFromLocalStorage();
    await renderTopics();
    addTopicCardEvents();
    renderDialog();
    addDialogEvents();

});

function addTopicCardEvents(){
    // 랜더링 된 대결 주제 카드 이벤트 -> 토너먼트 선택기 오픈
    document.querySelector('#topic-content-cards').addEventListener('click' , async function(event){
        const topicCard = event.target.closest('.topic-content-card');
        if (topicCard) {
            const topicId = topicCard.dataset.id;
            await openTournamentSelectDialog(topicId);
        }
    });
}

async function getTopics(){
    return await apiGetRequest('topics', {}, {});
}

async function renderTopics(){
    const topicContentCards = document.querySelector('#topic-content-cards');
    const {status, data : {topicList, pagination}} = await getTopics();

    clearTopicContentCards();

    topicList.forEach( topic => {
        const topicContentCard =
            `
            <div class="topic-content-card" data-id="${topic.id}">
                        <div class="topic-thumb-group" style="background-image: url('${topic.thumbnail}')"></div>
                        <div class="topic-desc-group">
                            <p class="topic-title">${topic.title}</p>
                            <p class="topic-subject">${topic.subject}</p>
                            <p class="topic-desc">${topic.description}</p>
                        </div>
                        <div class="btn-group">
                            <button class="btn-topic-stats" type="button"></button>
                            <button class="btn-topic-share" type="button"></button>
                        </div>
                    </div>
            `;
        topicContentCards.insertAdjacentHTML('beforeend', topicContentCard);
    });
}

/**
 * 대결주제 카드가 랜더링 대상(topic-content-cards) 비우기
 */
function clearTopicContentCards(){
    const topicContentCards = document.querySelector('#topic-content-cards');
    topicContentCards.replaceChildren();
}

function hasNextPage(currentPage = 1 , totalPages = 1 ){
    return currentPage < totalPages;
}

function initObserver(){
    renderScrollObserverTarget(); // 스크롤 옵저버 랜더링

    const scrollObserverTarget = document.querySelector('#scroll-observer-target');
    scrollObserver = new IntersectionObserver(async ([entry]) => {
       if(entry.isIntersecting){
           //await renderTopics();
           console.log(' ### 옵저버를 감지했어요 ###');
           await renderTopics();
       }
    }, {
        root : null,
        rootMargin : '0px',
        threshold: 1.0
    });

    scrollObserver.observe(scrollObserverTarget);
}

function unObserve(){
    const scrollObserverTarget = document.querySelector('#scroll-observer-target');
    scrollObserver.unobserve(scrollObserverTarget);
}

function renderScrollObserverTarget(){
    const topicContentsSection = document.querySelector('#topic-contents-section');

    const scrollObserverTarget = `<div id="scroll-observer-target" class="scroll-observer-target"></div>`;
    topicContentsSection.insertAdjacentHTML('beforeend',scrollObserverTarget);
}