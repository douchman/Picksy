const OrderType = {
    ASC: 'ASC',
    DESC: 'DESC',
};

export const tableQuery = {
    currentPage : 1,
    pageSize : 10,
    rankOrder : OrderType.ASC,
    totalMatchesOrder : OrderType.DESC,
    totalWinsOrder : OrderType.DESC,
    winRateOrder : OrderType.DESC,


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