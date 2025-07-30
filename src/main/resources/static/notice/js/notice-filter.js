import {noticeSearchParams} from "./notice-const.js";
import {removeAllNoticeCards} from "./notice-render.js";
import {startScrollObserver} from "./notice-scroll-observer.js";

let noticeKeywordDebounce;

export function setupNoticeFilter(){
    setupNoticeTypeSelectFilter();
    setupNoticeKeywordFilter();
}

// 피드 유형 선택 이벤트 처리
function setupNoticeTypeSelectFilter(){

    // 필터 선택 open
    window.addEventListener('click', function(e){
       const hasNoticeTypeFilterClass = ['selected-notice-type', 'notice-type-select-items'].some(cls => e.target.classList.contains(cls));
        toggleNoticeTypeFilterActive(hasNoticeTypeFilterClass);
    });

    document.querySelector('#notice-type-select-items').addEventListener('click', function(e){
        const noticeTypeSelectItem = e.target.closest('.notice-type-select-item');
        if(noticeTypeSelectItem) noticeTypeItemSelected(noticeTypeSelectItem);
    });
}

function noticeTypeItemSelected(selectedItem){
    const noticeType = selectedItem.value;
    const noticeTypeName = selectedItem.innerText;
    const selectedNoticeTypeEle = document.querySelector('#selected-notice-type');

    selectedNoticeTypeEle.innerText = noticeTypeName;

    noticeSearchParams.noticeType = noticeType;
    resetNoticeSearchParamsAndRender();

    toggleNoticeTypeFilterActive(false);
}

function toggleNoticeTypeFilterActive(isActive){
    document.querySelector('#notice-type-select').classList.toggle('active', isActive);
}

// 검색어 필터 이벤트 처리
function setupNoticeKeywordFilter(){
    document.querySelector('#notice-keyword').addEventListener('input', function(){
        if(noticeKeywordDebounce) clearTimeout(noticeKeywordDebounce);

        const keyword = this.value;
        noticeKeywordDebounce = setTimeout(() => {
            noticeSearchParams.keyword = keyword;
            resetNoticeSearchParamsAndRender();
        }, 500);
    });
}

function resetNoticeSearchParamsAndRender(){
    noticeSearchParams.initPage(); // 현재 페이지 값 리셋
    removeAllNoticeCards(); // 랜더링 된 공지사항 카드 모두 제거
    startScrollObserver(); // 옵저버 재시작
}
