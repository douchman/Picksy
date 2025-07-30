import {renderNotice} from "./notice-render.js";

let scrollObserver;

export function setupNoticeCardsObserver(){
    renderObserver();

    const scrollObserverTarget = document.querySelector('#scroll-observer-target');

    if(scrollObserverTarget){
        scrollObserver = new IntersectionObserver(async ([entry]) => {
            if(entry.isIntersecting) {
                const {hasMore} =  renderNotice();
                if( !hasMore ) stopScrollObserver(); // 표시 컨텐츠 없을 경우 옵저버 중지
            }
        },{
                root : null,
                rootMargin: '0px',
                threshold: 1.0,
        });
        scrollObserver.observe(scrollObserverTarget);
    }
}

export function stopScrollObserver(){
    const scrollObserverTarget = document.querySelector('#scroll-observer-target');
    if(!scrollObserverTarget) return;
    scrollObserver.unobserve(scrollObserverTarget);
}

export function startScrollObserver(){
    const scrollObserverTarget = document.querySelector('#scroll-observer-target');
    if(!scrollObserverTarget) return;
    scrollObserver.observe(scrollObserverTarget);
}


function renderObserver(){
    const noticeCards = document.querySelector('#notice-cards');
    const scrollObserverTarget = `<div id="scroll-observer-target" class="target"></div>`
    noticeCards.insertAdjacentHTML('beforeend', scrollObserverTarget);
}

