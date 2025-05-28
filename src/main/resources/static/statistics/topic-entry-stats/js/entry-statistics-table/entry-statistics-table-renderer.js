import {PROGRESS_BAR_COLOR_CLASS, tableQuery} from "./entry-statistics-table-const.js"
import {clearEntriesStatsTbody} from "./entry-statistics-table.js";
import {updatePaginationSetting} from "./entry-statistics-table-pagination.js";
import {getEntryStatistics} from "../api/entry-statistics-api.js";
import {topic} from "../const.js";
import {EntryStatisticsExceptionHandler} from "./exception/entry-statistics-exception-handler.js";

const entryStatisticsExceptionHandler = new EntryStatisticsExceptionHandler();

export async function renderEntryStatistics(isClearBody = true, isUpdatePaginationUi = false){

    isClearBody && clearEntriesStatsTbody();

    const requestBody = {
        keyword : tableQuery.keyword,
        rankOrderType : tableQuery.rankOrder,
        winRateOrderType : tableQuery.winRateOrder,
        page : tableQuery.currentPage,
        pageSize : tableQuery.pageSize
    }

    try {
        const entryStatisticsResult = await getEntryStatistics(topic.getId(), requestBody);

        const lastUpdatedAt = entryStatisticsResult.lastUpdatedAt;
        const entriesStatistics = entryStatisticsResult.entriesStatistics;
        const pagination = entryStatisticsResult.pagination;
        const isEntriesStatisticsEmpty = (!entriesStatistics || entriesStatistics.length === 0);

        renderLastUpdatedTime(lastUpdatedAt);
        if( !isEntriesStatisticsEmpty){

            const entriesStatsTbody = document.querySelector('#entries-stats-tbody');
            entriesStatistics.forEach( entryStats =>{
                const entry = entryStats.entry;
                const statistics = entryStats.statistics;
                const mediaType = entry.mediaType;
                const entryThumb = (mediaType === 'VIDEO' || mediaType === 'YOUTUBE') ? entry.thumbnail : entry.mediaUrl;
                const roundedWinRate = roundToNDecimal(statistics.winRate , 2);
                const winRateBarColorClass = determineProgressBarColorByWinRate(roundedWinRate);
                const entryStatsRow =
                    `<tr class="entry-row" style="--win-rate : ${roundedWinRate}%; --win-rate-text : '${roundedWinRate}%'" data-id="${entry.id}">
                        <td class="rank">${statistics.rank ? statistics.rank : '-'}</td>
                        <td class="entry-thumb" data-mediatype="${mediaType}" style="background-image: url('${entryThumb}')">
                            <input class="media-url" type="hidden" value="${entry.mediaUrl}">
                        </td>
                        <td class="entry-name">${entry.entryName}</td>
                        <td class="highest-tournament">${statistics.highestTournament}강</td>
                        <td class="win-and-lose">
                            ${renderWinLose(statistics.totalMatches, statistics.totalWins, statistics.totalLosses)}
                        </td>
                        <td class="win-rate">
                            <div class="win-rate-bar ${winRateBarColorClass}"></div>
                        </td>
                    </tr>`;

                entriesStatsTbody.insertAdjacentHTML('beforeend', entryStatsRow);
            });
        }
        updateTableQueryPagination(pagination);
        isUpdatePaginationUi && updatePaginationSetting();

    } catch(error) {
        entryStatisticsExceptionHandler.handle(error, {context : 'entryStatistics'});
        return false;
    }

    return true;
}

function renderLastUpdatedTime(lastUpdateAt){
    document.querySelector('#last-updated-time').textContent = lastUpdateAt;
}

// 승 & 패 그래프
function renderWinLose(totalMatches, win, lose){
    let winAndLose;
    let winLoseBar;
    if(totalMatches > 0){
        let winRatio = win / totalMatches * 100;
        let loseRatio = lose / totalMatches * 100;

        const onlyWinOrLose = Math.abs(winRatio - loseRatio) === 100 ? 'only' : '';


        winLoseBar =
            `<div class="win-lose-bar ${onlyWinOrLose}" style="--win-ratio: ${winRatio}%; --lose-ratio: ${loseRatio}%" >
                <div class="win"></div>
                <div class="lose"></div>
            </div>`;

        const winLoseBalloon =
            `<div class="win-lose-balloon">
                <p class="t-win">승:&nbsp;<span>${win}</span></p>/
                <p class="t-lose">패:&nbsp;<span>${lose}</span></p>
            </div>`;

        winAndLose = winLoseBar + winLoseBalloon
    } else {
        winAndLose = ``
    }

    return winAndLose;
}


// 테이블 쿼리 페이지네이션 최신화
function updateTableQueryPagination(pagination){
    tableQuery.totalPages = pagination.totalPages;
    tableQuery.totalItems = pagination.totalItems;
    tableQuery.currentPage = pagination.currentPage;
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