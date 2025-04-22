import {tableQuery} from "./entry-statistics-table-const.js";
import {renderEntryStatistics} from "./entry-statistics.js";

let isSyncingPagination = false; // 상단&하단 페이지네이션 동기화 제어 변수
let tableTopPagination;
let tableBottomPagination;

export function renderTablePagination(){

    tableTopPagination = new tui.Pagination(document.querySelector('#table-top-pagination'), {
        totalItems: tableQuery.totalItems,
        itemsPerPage: tableQuery.pageSize,
        visiblePages: 5,
        centerAlign: true
    });

    tableBottomPagination = new tui.Pagination(document.querySelector('#table-bottom-pagination'), {
        totalItems: tableQuery.totalItems,
        itemsPerPage: tableQuery.pageSize,
        visiblePages: 5,
        centerAlign: true
    });

    addTuiPaginationEvent(tableTopPagination, tableBottomPagination);
}

// 상단/하단 페이지네이션 현재 페이지 동기화
export function synchronizeCurrentPage(currentPage = 1){
    isSyncingPagination = true;
    tableTopPagination.movePageTo(currentPage);
    tableBottomPagination.movePageTo(currentPage);
    isSyncingPagination = false;
}

// 페이지네이션 설정 변경 후 다시 랜더링
export function updatePaginationSetting(){
    tableTopPagination.setTotalItems(tableQuery.totalItems);
    tableTopPagination.setItemsPerPage(tableQuery.pageSize);
    tableTopPagination.reset();

    tableBottomPagination.setTotalItems(tableQuery.totalItems);
    tableBottomPagination.setItemsPerPage(tableQuery.pageSize);
    tableBottomPagination.reset();

    synchronizeCurrentPage(tableQuery.currentPage);
}

function addTuiPaginationEvent(){

    // 상단 페이지네이션 -> 현재 페이지 변경
    tableTopPagination.on('afterMove', async function(eventData) {
        if(isSyncingPagination) return;
        tableQuery.currentPage = eventData.page;
        synchronizeCurrentPage(eventData.page);
        await renderEntryStatistics();
    });

    // 하단 페이지네이션 -> 현재 페이지 변경
    tableBottomPagination.on('afterMove', async function(eventData) {
        if(isSyncingPagination) return;
        tableQuery.currentPage = eventData.page;
        synchronizeCurrentPage(eventData.page);
        await renderEntryStatistics();
    });
}
