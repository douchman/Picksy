import {targetEntry, targetTopic} from "./const.js";
import {MediaType} from "../../../global/js/const.js";
import {setupEntryMediaViewer, showThumbViewer} from "../../../global/entry-media-viewer/js/entry-media-viewer.js";
import {getEntryVersusStatistics} from "./versus-statistics-api.js";
import {EntryVersusExceptionHandler} from "./exception/entry-versus-exception-handler";

const entryVersusExceptionHandler = new EntryVersusExceptionHandler();

/* 상대한 엔트리 셋업 */
// 상대한 엔트리 매치업 조회
// 랜더링
// 엔트리 미디어 뷰어 셋업
export async function setupOpponentEntries() {
    setupEntryMediaViewer(); // 미디어 뷰어 셋업

    try {

        const entryVersusStatisticsResult = await getEntryVersusStatistics(targetTopic.id, targetEntry.id);
        const matchUpRecord = entryVersusStatisticsResult.matchUpRecords;

        if( isMatchUpRecordExist(matchUpRecord)){
            renderMatchUpRecords(matchUpRecord);
        }
        addOpponentEntriesEvents();

    } catch(error){
        entryVersusExceptionHandler.handle(error, {context : 'entryVersusStats'});
        return false;
    }

    return true;
}

// 상대 엔트리 테이블 이벤트 등록
function addOpponentEntriesEvents(){
    document.querySelector('#opponent-entries-table-body').addEventListener('click', function(event){

        const opponentEntry = event.target.closest('.opponent-entry');
        const oppEntryThumbnail = event.target.closest('.opp-entry-thumbnail');

        if (opponentEntry && oppEntryThumbnail){ // 썸네일 -> 미디어 뷰어 오픈
            const mediaType = opponentEntry.dataset.mediatype;
            const mediaUrl = opponentEntry.dataset.mediaurl;
            showThumbViewer(mediaType, mediaUrl);
        } else if( opponentEntry) { // 엔트리 -> 해당 엔트리 상성 통계로 이동
            const opponentEntryId = opponentEntry.dataset.id;
            location.href = `/statistics/versus/topic/${targetTopic.id}/entry/${opponentEntryId}`;
        }

    });
}

function renderMatchUpRecords(matchUpRecord){
    const oppEntriesTableBody = document.querySelector('#opponent-entries-table-body');

    matchUpRecord.forEach(matchUpRecord => {
        const entryInfo = matchUpRecord.opponentEntry;
        const matchRecord = matchUpRecord.matchRecord;

        const entryMediaType = entryInfo.mediaType;

        const entryThumbnail = MediaType.isMediaTypeImage(entryMediaType) ? entryInfo.mediaUrl : entryInfo.thumbnail;

        const opponentEntry =
            `<tr class="opponent-entry" data-id="${entryInfo.id}" data-mediatype="${entryMediaType}" data-mediaurl="${entryInfo.mediaUrl}">
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
                <span class="vs-symbol">/</span>
                <p class="lose ${loseHigherClass}">${losses}</p>
            </div>`;
}

function isMatchUpRecordExist( matchUpRecords ){
    return (matchUpRecords && matchUpRecords.length !== 0);
}
