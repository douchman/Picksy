import {flushPlayRecordIdsFromLocalStorage} from "../../global/global.js";
import { HomeExceptionHandler} from "./exception/home-exception-handler.js";
import {topicSearchParams} from "./const.js";
import {searchTopics} from "./home-api.js";
import {shareTopic} from "../../global/util/share.js";

let scrollObserver;
let isLoading = false;

const homeExceptionHandler = new HomeExceptionHandler();

document.addEventListener('DOMContentLoaded', async () => {
    flushPlayRecordIdsFromLocalStorage();
    setupHome();

});

function setupHome(){
    addTopicSearchFilterEvents();
    addTopicCardEvents();
    setupInfiniteScrollObserver();
}

function addTopicSearchFilterEvents(){

    const keywordSearch = document.querySelector('#keyword-search');
    const btnSearchTopic = document.querySelector('#btn-search-topic');
    const orderFilter = document.querySelector('#order-filter');

    keywordSearch.addEventListener('keydown', function(event) {
        const keyEvent = event.key;
        if( keyEvent === 'Enter'){
            btnSearchTopic.click();
        }
    });

    btnSearchTopic.addEventListener('click', async () => {
        updateCurrentPageToFirst();
        clearTopicContentCards();
        startInfiniteScrollObserver();
    });

    orderFilter.addEventListener('change', function(event) {
        const orderType = event.target.value;
        updateTopicSearchSortBy(orderType);
        updateCurrentPageToFirst();
        clearTopicContentCards();
        startInfiniteScrollObserver();
    });
}

function addTopicCardEvents(){
    // 랜더링 된 대결 주제 카드 이벤트 -> 토너먼트 선택기 오픈
    document.querySelector('#topic-content-cards').addEventListener('click' , async function(event){
        const topicCard = event.target.closest('.topic-content-card');
        const btnTopicStats = event.target.closest('.btn-topic-stats');
        const btnTopicShare = event.target.closest('.btn-topic-share');
        if (btnTopicStats) {
            const topicId = topicCard.dataset.id;
            window.open(`/statistics/topic/${topicId}`, '_blank'); // 통계페이지 이동(새 탭 열기)
        } else if (btnTopicShare) {
            const topicId = topicCard.dataset.id;
            shareTopic(topicId);
        }
        else if (topicCard) {
            const topicId = topicCard.dataset.id;
            window.open(`/topic/play/${topicId}`, '_blank'); // 대결진행 페이지 이동(새 탭 열기)
        }
    });
}

async function renderTopics(){
    if ( isLoading ) return;
    isLoading = true;

    topicSearchParams.keyword = document.querySelector('#keyword-search').value

    const topicContentCards = document.querySelector('#topic-content-cards');

    try{
        const topicSearchResult = await searchTopics(topicSearchParams);

        const topicList = topicSearchResult.topicList;
        const pagination = topicSearchResult.pagination;

        if(hasNextPage(pagination.currentPage, pagination.totalPages)){
            topicSearchParams.page = (pagination.currentPage + 1 );
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
    } catch(error){
        stopInfiniteScrollObserver();
        homeExceptionHandler.handle(error);
    }

    isLoading = false;
}

function updateCurrentPageToFirst(page = 1) {
    topicSearchParams.page = page;
}

function updateTopicSearchSortBy(searchSortBy){
    topicSearchParams.searchSortBy = searchSortBy;
}

function hasNextPage(currentPage = 1 , totalPages = 1 ){
    return currentPage < totalPages;
}

function setupInfiniteScrollObserver(){
    renderScrollObserverTarget(); // 스크롤 옵저버 랜더링

    const scrollObserverTarget = document.querySelector('#scroll-observer-target');
    scrollObserver = new IntersectionObserver(async ([entry]) => {
       if(entry.isIntersecting){
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