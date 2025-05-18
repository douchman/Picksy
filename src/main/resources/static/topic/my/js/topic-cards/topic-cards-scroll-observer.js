import {renderMyTopics} from "./topic-cards-renderer.js";
import {getMyTopic} from "../api/my-topic-api.js";
import {MyTopicExceptionHandler} from "../exception/my-topic-exception-handler.js";
import {GetMyTopicException} from "../exception/MyTopicException.js";
import {topicSearchParams} from "./topic-cards-const.js";

let scrollObserver;
let isLoading = false;

const myTopicExceptionHandler = new MyTopicExceptionHandler();

// 옵저버 셋업
export function setupInfiniteScrollObserver(){
    renderScrollObserverTarget();

    const scrollObserverTarget = document.querySelector('#scroll-observer-target');
    scrollObserver = new IntersectionObserver(async ([entry]) => {
        if(entry.isIntersecting && !isLoading){
            isLoading = true;
            const myTopicResult = await getMyTopic(topicSearchParams);

            if( !myTopicResult ){
                myTopicExceptionHandler.handle(new GetMyTopicException());
            } else {
                const topicList = myTopicResult.topicList;
                const pagination = myTopicResult.pagination;

                await renderMyTopics(topicList);
                handlePagination(pagination);
            }

            isLoading = false;
        }
    }, {
        root : null,
        rootMargin : '0px',
        threshold: 1.0
    });

    scrollObserver.observe(scrollObserverTarget);
}


function renderScrollObserverTarget(){
    const topicCardWrapper = document.querySelector('#topic-card-wrapper');

    const scrollObserverTarget = `<div id="scroll-observer-target" class="scroll-observer-target"></div>`;
    topicCardWrapper.insertAdjacentHTML('beforeend',scrollObserverTarget);
}

function handlePagination(pagination){
    console.log('### handlePagination ####')
    const hasNext = pagination.currentPage < pagination.totalPages;
    if( !hasNext ){
        stopInfiniteScrollObserver();
    } else {
        topicSearchParams.page = pagination.currentPage + 1;
    }
}

function stopInfiniteScrollObserver(){
    const scrollObserverTarget = document.querySelector('#scroll-observer-target');
    scrollObserver.unobserve(scrollObserverTarget);
}

export function startInfiniteScrollObserver(){
    const scrollObserverTarget = document.querySelector('#scroll-observer-target');
    scrollObserver.observe(scrollObserverTarget);
}

