import {topic} from "./const.js";
import {apiGetRequest} from "../../../global/js/api.js";
import {tableQuery} from "./enry-statistics-table-const.js"

const PROGRESS_BAR_COLOR_CLASS = {
    20 : 'color-20',
    40 : 'color-40',
    60 : 'color-60',
    80 : 'color-80',
    100 : 'color-100'
}

export async function renderEntryStatistics(isClearBody = true){

    isClearBody && clearEntriesStatsTbody();

    const { status, data : {entriesStatistics, pagination}  } = await getEntryStatistics();

    if( status === 200){
        const isEntriesStatisticsEmpty = (!entriesStatistics || entriesStatistics.length === 0);
        if( !isEntriesStatisticsEmpty){

            const entriesStatsTbody = document.querySelector('#entries-stats-tbody');
            entriesStatistics.forEach( entryStats =>{
                const entry = entryStats.entry;
                const statistics = entryStats.statistics;
                const roundedWinRate = roundToNDecimal(statistics.winRate , 2);
                const winRateBarColorClass = determineProgressBarColorByWinRate(roundedWinRate);
                const entryStatsRow =
                    `<tr style="--win-rate : ${roundedWinRate}%; --win-rate-text : '${roundedWinRate}%'">
                        <td class="rank">${statistics.rank ? statistics.rank : '-'}</td>
                        <td class="entry-thumb"><img src="${entry.mediaUrl}" alt="entry-thumb"></td>
                        <td class="entry-name">${entry.entryName}</td>
                        <td class="highest-tournament">${statistics.highestTournament}강</td>
                        <td class="win-rate">
                            <div class="win-rate-bar ${winRateBarColorClass}"></div>
                        </td>
                    </tr>`;

                entriesStatsTbody.insertAdjacentHTML('beforeend', entryStatsRow);
            });
        }
        updateTableQueryPagination(pagination);

        return true;
    } else{
        // TODO : handle getEntriesStats Exception

        return false;
    }
}

// 테이블 body 내 랜더링 된 기존 컨텐츠 비우기
function clearEntriesStatsTbody(){
    document.querySelector('#entries-stats-tbody').replaceChildren();
}

// 테이블 쿼리 페이지네이션 최신화
function updateTableQueryPagination(pagination){
    tableQuery.setTotalPages(pagination.totalPages);
    tableQuery.setTotalItems(pagination.totalItems)
    tableQuery.setCurrentPage(pagination.currentPage);

}

// 소수 점 줄이기
function roundToNDecimal(value, n){
    if( value ){
        return Number(value.toFixed(n));
    }
    return 0;
}

function determineProgressBarColorByWinRate(winRate){
    if( winRate === 100){
        return PROGRESS_BAR_COLOR_CLASS[100]
    }

    if( winRate >= 80){
        return PROGRESS_BAR_COLOR_CLASS[80]
    }

    if( winRate >= 60){
        return PROGRESS_BAR_COLOR_CLASS[60]
    }

    if( winRate >= 40){
        return PROGRESS_BAR_COLOR_CLASS[40]
    }

    return PROGRESS_BAR_COLOR_CLASS[20]
}

async function getEntryStatistics(){
    const requestBody = {
        rankOrderType : tableQuery.getRankOrder(),
        page : tableQuery.getCurrentPage(),
        pageSize : tableQuery.getPageSize()
    }

    return await apiGetRequest(`statistics/topics/${topic.getId()}/entries`, {}, requestBody);
}