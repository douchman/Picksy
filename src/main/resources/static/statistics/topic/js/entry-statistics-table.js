import {entryStatsTable} from "./const.js";
import {RankSort, ScoreSort, tableQuery} from "./enry-statistics-table-const.js";
import {renderEntryStatistics} from "./entry-statistics.js";
import {showThumbViewer} from "./entry-thumb-viewer.js";

let keywordSearchDebounceTimer;

// 엔트리 통계 테이블 관련 이벤트 등록
export function addEntryStatisticsTableEvents(){
    addItemPerPageEvent();
    addItemCountListEvent();
    addSearchFilterEvent();
    addTableHeaderOrderEvent();
    addEntryThumbnailEvent();
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

        tableQuery.pageSize = itemPerPageCount; // 표시 갯수 변경
        await renderEntryStatistics(true, true); // 표기 갯수에 맞추어 랜더링
    });
}

// 검색어 필터 이벤트
function addSearchFilterEvent(){
    document.querySelector('#search-keyword').addEventListener('keydown', async function(){
        await searchEntryWithKeyword();
    });
}

// 테이블 헤더 항목 정렬 이벤트
function addTableHeaderOrderEvent(){
    document.querySelectorAll('th.order').forEach(orderHead => {

        orderHead.addEventListener('click', async function(){
            const isDown = this.classList.contains('down');
            const orderType = this.dataset.ordertype;

            if( isDown ){ // 높은 순서 정렬로 변경
                this.classList.remove('down');
                orderType === 'rankOrder' ?
                    tableQuery[orderType] = RankSort.LOWEST_FIRST
                    : tableQuery[orderType] = ScoreSort.HIGHEST_FIRST;
            } else { // 낮은 순서 정렬로 변경
                this.classList.add('down');
                orderType === 'rankOrder' ?
                    tableQuery[orderType] = RankSort.HIGHEST_FIRST
                    : tableQuery[orderType] = ScoreSort.LOWEST_FIRST;
            }

            await renderEntryStatistics(true, false);
        });
    });
}

// 썸네일 클릭 이벤트
function addEntryThumbnailEvent(){
    document.querySelector('#entries-stats-tbody').addEventListener('click', function(event){
        const entryThumb = event.target.closest('.entry-thumb');
        if( entryThumb ){
            const mediaType = entryThumb.dataset.mediatype;
            const mediaUrl = entryThumb.querySelector('.media-url').value;
            showThumbViewer(mediaType, mediaUrl);
        }
    });
}

async function searchEntryWithKeyword(){
    if( keywordSearchDebounceTimer ) clearTimeout(keywordSearchDebounceTimer);

    keywordSearchDebounceTimer = setTimeout(async () => {
        tableQuery.keyword = document.querySelector('#search-keyword').value;
        await renderEntryStatistics(true, false);
    }, 600);
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