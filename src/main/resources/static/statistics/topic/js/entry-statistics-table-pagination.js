import {tableQuery} from "./enry-statistics-table-const.js";

let isSyncingPagination = false; // 상단&하단 페이지네이션 동기화 제어 변수
let tableTopPagination;
let tableBottomPagination;

export function renderPagination(){

    tableTopPagination = new tui.Pagination(document.querySelector('#table-top-pagination'), {
        totalItems: tableQuery.getTotalItems(),
        itemsPerPage: tableQuery.getPageSize(),
        visiblePages: 5,
        centerAlign: true
    });

    tableBottomPagination = new tui.Pagination(document.querySelector('#table-bottom-pagination'), {
        totalItems: tableQuery.getTotalItems(),
        itemsPerPage: tableQuery.getPageSize(),
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

function addTuiPaginationEvent(){

    // 상단 페이지네이션 -> 현재 페이지 변경
    tableTopPagination.on('afterMove', function(eventData) {
        if(isSyncingPagination) return;
        tableQuery.setCurrentPage(eventData.page);
        synchronizeCurrentPage(eventData.page);
        // TODO : 페이지에 맞추어
    });

    // 하단 페이지네이션 -> 현재 페이지 변경
    tableBottomPagination.on('afterMove', function(eventData) {
        if(isSyncingPagination) return;
        tableQuery.setCurrentPage(eventData.page);
        synchronizeCurrentPage(eventData.page);
    });

}
