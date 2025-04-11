const OrderType = {
    ASC: 'ASC',
    DESC: 'DESC',
};

export const tableQuery = {
    totalItems : 0,
    totalPages : 0,
    currentPage : 1,
    pageSize : 10,
    rankOrder : OrderType.ASC,
    totalMatchesOrder : OrderType.DESC,
    totalWinsOrder : OrderType.DESC,
    winRateOrder : OrderType.DESC,

    setTotalItems(totalItems){
        this.totalItems = totalItems;
    },

    getTotalItems(){
        return this.totalItems;
    },

    setTotalPages(totalPages){
        this.totalPages = totalPages;
    },

    getTotalPages(){
        return this.totalPages;
    },

    setCurrentPage(currentPage){
        this.currentPage = currentPage;
    },

    getCurrentPage(){
        return this.currentPage
    },

    setPageSize(pageSize){
        this.pageSize = pageSize;
    },

    getPageSize(){
        return this.pageSize;
    },

    getRankOrder(){
        return this.rankOrder;
    },
    getTotalMatchesOrder(){
        return this.totalMatchesOrder;
    },
    getTotalWinsOrder(){
        return this.totalWinsOrder;
    },
    getWinRateOrder(){
        return this.winRateOrder;
    },

    setRankOrder(orderType){
        this.rankOrder = orderType;
    },
    setTotalMatchesOrder(orderType){
        this.totalMatchesOrder = orderType;
    },
    setTotalWinsOrder(orderType){
        this.totalWinsOrder = orderType;
    },
    setWinRateOrder(orderType){
        this.winRateOrder = orderType;
    },
}