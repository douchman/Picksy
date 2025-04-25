import {targetEntry, targetTopic} from "./const.js";
import {apiGetRequest} from "../../../global/js/api.js";
import {MediaType} from "../../../global/js/const.js";

/* 상대한 엔트리 셋업 */
// 상대한 엔트리 매치업 조회
// 랜더링
export async function setupOpponentEntries() {
    const {status, data : entryVersusStatisticsResult} = await getEntryVersusStatistics();

    if( status === 200) {

        const matchUpRecord = entryVersusStatisticsResult.matchUpRecords;

        if( isMatchUpRecordExist(matchUpRecord)){
            renderMatchUpRecords(matchUpRecord);
        }

    } else {
        // TODO : target entry versus statistics exception
        return false;
    }
    return true;

}

function renderMatchUpRecords(matchUpRecord){
    const oppEntriesTableBody = document.querySelector('#opponent-entries-table-body');

    console.log('oppEntriesTableBody -> ' , oppEntriesTableBody);
    matchUpRecord.forEach(matchUpRecord => {
        const entryInfo = matchUpRecord.opponentEntry;
        const matchRecord = matchUpRecord.matchRecord;

        const entryMediaType = entryInfo.mediaType;

        const entryThumbnail = MediaType.isMediaTypeImage(entryMediaType) ? entryInfo.mediaUrl : entryInfo.thumbnail;
        const opponentEntry =
            `<tr class="opponent-entry">
                <td class="opp-entry-thumbnail" style="background-image: url('${entryThumbnail}')"></td>
                <td class="opp-entry-info">
                    <div class="info-group">
                    <p class="opp-entry-name">${entryInfo.entryName}</p>
                    <p class="opp-entry-desc">${entryInfo.description}</p>
                    </div>
                </td>
                <td class="match-record">
                    ${renderMatchResult(matchRecord)}
                </td>
                <td class="versus-rate">
                    <div class="versus-rate-bar" style="--win-rate : ${matchRecord.winRate}%; --win-rate-text : '${matchRecord.winRate}%';"></div>
                </td>
            </tr>`;

        oppEntriesTableBody.insertAdjacentHTML('beforeend', opponentEntry);
    });
}

function renderMatchResult(matchRecord){
    const wins = matchRecord.wins;
    const losses = matchRecord.losses;

    const winHigherClass = (wins > losses) ? 'higher' : '';
    const loseHigherClass = (losses > wins) ? 'higher' : '';

    return `<div class="match-result">
                <p class="win ${winHigherClass}">${wins}</p>
                <span class="vs-symbol">:</span>
                <p class="lose ${loseHigherClass}">${losses}</p>
            </div>`;
}

function isMatchUpRecordExist( matchUpRecords ){
    return (matchUpRecords && matchUpRecords.length !== 0);
}

async function getEntryVersusStatistics(){
    return await apiGetRequest(`statistics/versus/topics/${targetTopic.id}/entries/${targetEntry.id}`);
}
