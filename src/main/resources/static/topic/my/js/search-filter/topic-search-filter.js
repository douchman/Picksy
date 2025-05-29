import {topicSearchParams} from "../const/topic-search-params.js";
import {clearTopicCardsContents} from "../topic-cards/topic-cards-renderer.js";
import {startInfiniteScrollObserver} from "../topic-cards/topic-cards-scroll-observer.js";
import {Visibility} from "../../../../global/const/const.js";

export function setupSearchFilter(){
    addSearchFilterEvents();
}

function addSearchFilterEvents(){
    addSearchVisibilityFilterEvent();
    addSearchOrderEvent();
    addKeywordSearchEvent();
}

function addSearchVisibilityFilterEvent(){
    document.querySelector('#filter-visibility').addEventListener('change', function(e){
        if(e.target.matches('input.search-visibility')){
            handleFilterVisibilityChange(e.target);
        }
    })
}

function addSearchOrderEvent(){
    document.querySelector('#filter-order').addEventListener('change', function(e){
       if(e.target.matches('input.search-order')){
           handleFilterOrderChange(e.target);
       }
    });
}

function addKeywordSearchEvent(){
    document.querySelector('#btn-search-topic').addEventListener('click', function(){
        handleKeywordSearch();
    });


    document.querySelector('#keyword-search').addEventListener('keydown', function(e){
        const keyEvent = e.key;
        if( keyEvent === 'Enter'){
            handleKeywordSearch();
        }
    });
}

function handleFilterVisibilityChange(searchVisibility){
    const visibility = searchVisibility.value;
    updateTopicSearchParamsVisibility(visibility);
    refreshTopicCards();
}

function handleFilterOrderChange(searchOrder){
    const sortBy = searchOrder.value;
    updateTopicSearchParamsSortBy(sortBy);
    refreshTopicCards();
}

function handleKeywordSearch(){
    const keyword = document.querySelector('#keyword-search').value;
    updateTopicSearchParamsKeyword(keyword);
    refreshTopicCards();
}

function updateTopicSearchParamsVisibility(visibility){
    if( Visibility.isAvailableVisibility(visibility) ){
        topicSearchParams.visibility = visibility;
    } else {
        delete topicSearchParams.visibility;
    }
}

function updateTopicSearchParamsSortBy(sortBy){
    topicSearchParams.searchSortBy = sortBy;
}

function updateTopicSearchParamsKeyword(keyword){
    topicSearchParams.keyword = keyword;
}

function refreshTopicCards(){
    topicSearchParams.setPageToFirst(); // 페이지 1로 초기화
    clearTopicCardsContents(); // 랜더링 된 대결주제 카드 비우기
    startInfiniteScrollObserver(); // 옵저버 재시작
}