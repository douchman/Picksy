import {entryStatsTable} from "./const.js";
import {tableQuery} from "./enry-statistics-table-const.js";
import {renderEntryStatistics} from "./entry-statistics.js";

// 엔트리 통계 테이블 관련 이벤트 등록
export function addEntryStatisticsTableEvents(){
    addItemPerPageEvent();
    addItemCountListEvent();
    addTableHeaderOrderEvent();
}

// 테이블 컨텐츠 표기 갯수 선택기 이벤트
function addItemPerPageEvent(){
    const itemPerPage = document.querySelector('#item-per-page');

    // 표시기 외 영역 선택시 닫기
    window.addEventListener('click', function(event){
        const hasItemPerPageClass = ['item-per-page', 'item-count'].some(cls =>
            event.target.classList.contains(cls));
        !hasItemPerPageClass && toggleFilterItemCountActive(false);
    });

    itemPerPage.addEventListener('click', () =>{
        toggleFilterItemCountActive(true);
    });
}

// 테이블 컨텐츠 표기 갯수 선택기 옵션 이벤트
function addItemCountListEvent(){
    const itemPerPage = document.querySelector('#item-per-page');
    const itemCountList = document.querySelector('#item-count-list');

    itemCountList.addEventListener('click', async function(event){
        const itemCount = event.target.closest('.item-count');
        const itemPerPageCount = itemCount.dataset.count;
        const countText = itemCount.innerText;

        itemPerPage.value = itemPerPageCount;
        itemPerPage.innerText = countText;

        entryStatsTable.setItemPerPage(itemPerPageCount);
        toggleFilterItemCountActive(false);

        tableQuery.setPageSize(itemPerPageCount); // 표시 갯수 변경
        await renderEntryStatistics(true, true); // 표기 갯수에 맞추어 랜더링
    });
}

// 테이블 헤더 항목 정렬 이벤트
function addTableHeaderOrderEvent(){
    document.querySelectorAll('th.order').forEach(orderHead => {

        orderHead.addEventListener('click', function(){
            const isAsc = this.classList.contains('asc');
            const orderType = this.dataset.ordertype;

            // TODO : 테이블 쿼리 수정
            if( isAsc ){
                this.classList.remove('asc');
            } else {
                this.classList.add('asc');
            }
        });

    });
}

// 테이블 body 내 랜더링 된 기존 컨텐츠 비우기
export function clearEntriesStatsTbody(){
    document.querySelector('#entries-stats-tbody').replaceChildren();
}

// 테이블 컨텐츠 표기 갯수 선택기 보임/숨김 토글
function toggleFilterItemCountActive(active = false){
    const filterItemCount = document.querySelector('#filter-item-count');
    active ?
        filterItemCount.classList.add('active')
        : filterItemCount.classList.remove('active');
}