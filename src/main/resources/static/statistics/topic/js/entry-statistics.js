import {topic} from "./const.js";
import {apiGetRequest} from "../../../global/js/api.js";

const PROGRESS_BAR_COLOR_CLASS = {
    20 : 'color-20',
    40 : 'color-40',
    60 : 'color-60',
    80 : 'color-80',
    100 : 'color-100'
}

export async function renderEntryStatistics(){
    const { status, data : {entriesStatistics, pagination}  } = await getEntryStatistics();

    console.log('renderEntryStatistics status -> ', status)
    //console.log('renderEntryStatistics entriesStatistics -> ', entriesStatistics);

    if( status === 200){
        const isEntriesStatisticsEmpty = (!entriesStatistics || entriesStatistics.length === 0);
        if( !isEntriesStatisticsEmpty){

            const entriesStatsTbody = document.querySelector('#entries-stats-tbody');
            entriesStatistics.forEach( entryStats =>{
                const entry = entryStats.entry;
                const statistics = entryStats.statistics;
                console.log('entryStats => ' ,entryStats);
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

        return true;
    } else{
        // TODO : handle getEntriesStats Exception

        return false;
    }
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
    return await apiGetRequest(`statistics/topics/${topic.getId()}/entries`)
}