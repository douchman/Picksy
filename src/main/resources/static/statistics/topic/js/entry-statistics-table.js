import {entryStatsTable} from "./const.js";

// 엔트리 통계 테이블 관련 이벤트 등록
export function addEntryStatisticsTableEvents(){
    addItemPerPageEvent();
    addItemCountListEvent();
}

// 테이블 컨텐츠 표기 갯수 선택기 이벤트
function addItemPerPageEvent(){
    const itemPerPage = document.querySelector('#item-per-page');
    itemPerPage.addEventListener('click', () =>{
        toggleFilterItemCountActive(true);
    });
}

// 테이블 컨텐츠 표기 갯수 선택기 옵션 이벤트
function addItemCountListEvent(){
    const itemPerPage = document.querySelector('#item-per-page');
    const itemCountList = document.querySelector('#item-count-list');

    itemCountList.addEventListener('click', function(event){
        const itemCount = event.target.closest('.item-count');
        const itemPerPageCount = itemCount.dataset.count;
        const countText = itemCount.innerText;

        itemPerPage.value = itemPerPageCount;
        itemPerPage.innerText = countText;

        entryStatsTable.setItemPerPage(itemPerPageCount);
        toggleFilterItemCountActive(false);
        
        // TODO : 변경된 갯수대로 엔트리 통계 랜더링
    });
}

// 테이블 컨텐츠 표기 갯수 선택기 보임/숨김 토글
function toggleFilterItemCountActive(active = false){
    const filterItemCount = document.querySelector('#filter-item-count');
    active ?
        filterItemCount.classList.add('active')
        : filterItemCount.classList.remove('active');
}