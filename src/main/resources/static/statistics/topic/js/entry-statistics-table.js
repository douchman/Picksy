import {entryStatsTable, topic} from "./const.js";
import {RankSort, ScoreSort, tableQuery} from "./entry-statistics-table-const.js";
import {renderEntryStatistics} from "./entry-statistics.js";
import {setupEntryMediaViewer, showThumbViewer} from "../../../global/entry-media-viewer/js/entry-media-viewer.js";
import {renderTablePagination} from "./entry-statistics-table-pagination.js";
import {setupUserComment} from "./comment.js";

let keywordSearchDebounceTimer;

/* 엔트리 통계 테이블 관련 셋업 */
// 이벤트 등록
// 페이지 네이션 랜더링
// 미디어 뷰어 셋업
export async function setupEntryStatisticsTable(){
    checkTableQueryParams();
    await renderEntryStatistics();
    addEntryStatisticsTableEvents(); // 테이블 이벤트 등록
    renderTablePagination(); // 페이지네이션 랜더링
    setupEntryMediaViewer(); // 엔트리 미디어 뷰어 셋업
    setupUserComment(); // 유저 코멘트 셋업
}

// 엔트리 통계 테이블 관련 이벤트 등록
function addEntryStatisticsTableEvents(){
    addItemPerPageEvent();
    addItemCountListEvent();
    addSearchFilterEvent();
    addTableHeaderOrderEvent();
    addEntryRowEvents();
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

function addEntryRowEvents(){

    document.querySelector('#entries-stats-tbody').addEventListener('click', function(event){
        const entryRow = event.target.closest('.entry-row'); // 엔트리 tr
        const entryThumb = event.target.closest('.entry-thumb'); // 엔트리 tr > 썸네일

        if( entryThumb ){ // 썸네일 이벤트 처리
            const mediaType = entryThumb.dataset.mediatype;
            const mediaUrl = entryThumb.querySelector('.media-url').value;
            showThumbViewer(mediaType, mediaUrl);
        } else if ( entryRow) { // 로우 클릭 이벤트 처리
            const entryId = entryRow.dataset.id;
            moveToEntryVersusStats(entryId);
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

function moveToEntryVersusStats(entryId){
    saveTableQueryToSessionStorage();
    location.href = `/statistics/versus/topic/${topic.getId()}/entry/${entryId}`;
}

function saveTableQueryToSessionStorage(){
    sessionStorage.setItem(`tableQuery-${topic.getId()}`, JSON.stringify(tableQuery));
}

function removeTableQueryFromSessionStorage(){
    sessionStorage.removeItem(`tableQuery-${topic.getId()}`);
}

function checkTableQueryParams(){
    const urlParams = new URLSearchParams(window.location.search);
    const tableQueryParam  = urlParams.get('tableQuery');
    const isTableQueryRestore = tableQueryParam === 'Y';

    if( isTableQueryRestore ){ // 테이블 쿼리 파라미터 확인
        removeTableQueryParam(); // 쿼리 파라미터 제거
        const saved = sessionStorage.getItem(`tableQuery-${topic.getId()}`);
        if( saved ){
            const restoredQuery = JSON.parse(saved);
            Object.assign(tableQuery, restoredQuery); // 테이블 쿼리 교체
            removeTableQueryFromSessionStorage(); // 스토리지 비우기
            syncTableQueryUI(); // 랜더링 UI 싱크
        }
    }
}

// URL 내 파라미터 쿼리 제거
function removeTableQueryParam(){
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.delete('tableQuery');
    window.history.replaceState({}, '', newUrl.toString());
}

// 교체된 테이블 쿼리에 맞추어 UI 싱크
function syncTableQueryUI(){
    updateItemPerPageUI();
    updateSearchKeyword();
}

// 표시갯수 변경
function updateItemPerPageUI(){
    const itemPerPage = document.querySelector('#item-per-page');
    itemPerPage.value = tableQuery.pageSize;
    itemPerPage.textContent = `${tableQuery.pageSize}개`;
}

function updateSearchKeyword(){
    document.querySelector('#search-keyword').value = `${tableQuery.keyword}`;
}

