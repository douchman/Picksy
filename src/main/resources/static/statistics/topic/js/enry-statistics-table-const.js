export const RankSort = {
    LOWEST_FIRST: 'ASC',
    HIGHEST_FIRST: 'DESC',
};

export const ScoreSort = {
    HIGHEST_FIRST: 'DESC',
    LOWEST_FIRST: 'ASC',
};

export const tableQuery = {
    totalItems : 0,
    totalPages : 0,
    currentPage : 1,
    pageSize : 10,
    rankOrder : RankSort.LOWEST_FIRST,
    totalMatchesOrder : ScoreSort.HIGHEST_FIRST,
    totalWinsOrder : ScoreSort.HIGHEST_FIRST,
    winRateOrder : ScoreSort.HIGHEST_FIRST
}