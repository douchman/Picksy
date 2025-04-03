import {apiGetRequest} from '../../global/js/api.js';
import {addDialogEvents, renderDialog, openTournamentSelectDialog} from "./tournament-select-dialog.js";
import {flushPlayRecordIdsFromLocalStorage} from "../../global/js/vstopic-localstorage.js";
import {handleTopicRenderException} from "./exception.js";

let scrollObserver;
const pageSize = 16;
let currentPage = 1;
let isLoading = false;

document.addEventListener('DOMContentLoaded', async () => {
    flushPlayRecordIdsFromLocalStorage();
    addTopicSearchFilterEvents();
    addTopicCardEvents();
    renderDialog();
    addDialogEvents();
    setupInfiniteScrollObserver();
});

function addTopicSearchFilterEvents(){

    const keywordSearch = document.querySelector('#keyword-search');
    const btnSearchTopic = document.querySelector('#btn-search-topic');

    keywordSearch.addEventListener('keydown', function(event) {
        const keyEvent = event.key;
        if( keyEvent === 'Enter'){
            btnSearchTopic.click();
        }
    });

    btnSearchTopic.addEventListener('click', async () => {
        initCurrentPage();
        clearTopicContentCards();
        startInfiniteScrollObserver();
    });
}

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

async function getTopics(requestParams){
    return await apiGetRequest('topics', {}, requestParams);
}

async function renderTopics(){
    if ( isLoading ) return;
    isLoading = true;

    const keyword = document.querySelector('#keyword-search').value;
    const requestParams = {
        keyword : keyword,
        page : currentPage,
        size : pageSize
    }

    const topicContentCards = document.querySelector('#topic-content-cards');

    const {status, data : topicResult} = await getTopics(requestParams);

    const topicList = topicResult.topicList;
    const pagination = topicResult.pagination;

    if( status === 200 ){
        if(hasNextPage(pagination.currentPage, pagination.totalPages)){
            currentPage++;
        }else{
            stopInfiniteScrollObserver();
        }

        const isTopicListEmpty = (!topicList || topicList.length === 0);
        if ( !isTopicListEmpty ){
            toggleTopicContentsSectionEmpty(false);
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
        } else {
            toggleTopicContentsSectionEmpty(true);
        }
    } else {
        stopInfiniteScrollObserver();
        handleTopicRenderException(topicResult);
    }

    isLoading = false;
}

/**
 * 현 페이지 초기화
 * @param {number} page
 */
function initCurrentPage(page = 1) {
    currentPage = page;
}

function hasNextPage(currentPage = 1 , totalPages = 1 ){
    return currentPage < totalPages;
}

function setupInfiniteScrollObserver(){
    renderScrollObserverTarget(); // 스크롤 옵저버 랜더링

    const scrollObserverTarget = document.querySelector('#scroll-observer-target');
    scrollObserver = new IntersectionObserver(async ([entry]) => {
       if(entry.isIntersecting){
           //await renderTopics();
           await renderTopics();
       }
    }, {
        root : null,
        rootMargin : '0px',
        threshold: 1.0
    });

    scrollObserver.observe(scrollObserverTarget);
}

function stopInfiniteScrollObserver(){
    const scrollObserverTarget = document.querySelector('#scroll-observer-target');
    scrollObserver.unobserve(scrollObserverTarget);
}

function startInfiniteScrollObserver(){
    const scrollObserverTarget = document.querySelector('#scroll-observer-target');
    scrollObserver.observe(scrollObserverTarget);
}

function renderScrollObserverTarget(){
    const topicContentsSection = document.querySelector('#topic-contents-section');

    const scrollObserverTarget = `<div id="scroll-observer-target" class="scroll-observer-target"></div>`;
    topicContentsSection.insertAdjacentHTML('beforeend',scrollObserverTarget);
}

function toggleTopicContentsSectionEmpty(isEmpty = false){
    const topicContentsSection = document.querySelector('#topic-contents-section');
    isEmpty ?
        topicContentsSection.classList.add('empty')
        : topicContentsSection.classList.remove('empty');
}
/**
 * 대결주제 카드 랜더링 대상(topic-content-cards) 비우기
 */
function clearTopicContentCards(){
    const topicContentCards = document.querySelector('#topic-content-cards');
    topicContentCards.replaceChildren();
    isLoading = false;
}