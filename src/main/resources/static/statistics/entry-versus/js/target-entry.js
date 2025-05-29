import {targetTopic, targetEntry, TournamentStageName} from "./const.js"
import {MediaType} from "../../../global/const/const.js";
import {getTargetEntryStatistics} from "./versus-statistics-api.js";
import {EntryVersusExceptionHandler} from "./exception/entry-versus-exception-handler.js";

const entryVersusExceptionHandler = new EntryVersusExceptionHandler();

/* 조회 대상 엔트리 셋업 */
// 엔트리 상세 정보 & 통계 조회
// 랜더링
export async function setupTargetEntry(){
    try {
        const targetEntryStatsResult = await getTargetEntryStatistics(targetTopic.id, targetEntry.id);

        const targetEntryDetail = targetEntryStatsResult.entry;
        const targetEntryStats = targetEntryStatsResult.statistics;

        renderTargetEntryInfo(targetEntryDetail);
        renderTargetEntryStatistics(targetEntryStats);

    } catch (error){
        entryVersusExceptionHandler.handle(error, {context : 'targetEntryStats'});
        return false;
    }

    return true;
}


function renderTargetEntryInfo(entryInfo){
    const entryMediaType = entryInfo.mediaType;
    const targetEntryThumbnail = document.querySelector('#target-entry-thumbnail')
    document.querySelector('#target-entry-name').textContent = entryInfo.entryName;
    document.querySelector('#target-entry-desc').textContent = entryInfo.description;

    if( MediaType.isMediaTypeImage(entryMediaType) ){ // 이미지인 경우 mediaUrl 을 그대로 랜더링
        targetEntryThumbnail.style.backgroundImage = `url(${entryInfo.mediaUrl})`;
    } else {
        targetEntryThumbnail.style.backgroundImage = `url(${entryInfo.thumbnail})`;
    }
}

function renderTargetEntryStatistics(entryStats){
    // 승,패 정보
    document.querySelector('#target-entry-win').textContent = entryStats.totalWins;
    document.querySelector('#target-entry-lose').textContent = entryStats.totalLosses;

    // 승률 정보
    const targetEntryWinRateBar = document.querySelector('#target-entry-win-rate-bar')
    const roundedTargetEntryWinRate = roundToNDecimal(entryStats.winRate);

    targetEntryWinRateBar.style.setProperty('--win-rate' , roundedTargetEntryWinRate + '%');
    targetEntryWinRateBar.style.setProperty('--win-rate-text' , `'${roundedTargetEntryWinRate}%'`);

    // 가장 높이 올라간 토너먼트
    document.querySelector('#target-entry-highest-tournament').textContent = TournamentStageName.getTournamentStageNameByTournament(entryStats.highestTournament);
}

// 소수 점 줄이기
function roundToNDecimal(value, n){
    if( value ){
        return Number(value.toFixed(n));
    }
    return 0;
}
