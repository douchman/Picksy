import {apiGetRequest, apiPatchRequest} from "../../../global/js/api.js";
import {match, playRecord} from "./const.js";
import {renderEntriesAndAddEvents} from "./entry-render.js";
import {handleTopicPlayException} from "./exceptionHandler.js";
import {showToastMessage} from "../../../global/popup/js/common-toast-message.js";
import {flushPlayRecordIdsFromLocalStorage} from "../../../global/js/vstopic-localstorage.js";

// 엔트리 대진표 조회
export async function loadEntryMatchInfo() {
    const {status, data: matchInfo} = await getMatch();

    if (status === 200) {
        const matchId = matchInfo.matchId;
        const currentTournament = matchInfo.currentTournament;
        const entryMatch = matchInfo.entryMatch;

        match.setId(matchId);
        displayCurrentTournament(currentTournament);
        renderEntriesAndAddEvents(entryMatch);
    } else {
        handleTopicPlayException(matchInfo);
    }
}

// 엔트리 대결 결과 제출
export async function submitEntryMatchResult(winnerEntry, loserEntry){

    toggleMatchStageStatus(true);
    toggleEntrySlotClickBlock(true);

    const winnerEntryId = winnerEntry.dataset.id;
    const loserEntryId = loserEntry.dataset.id;

    const requestBody = {
        winnerEntryId : winnerEntryId,
        loserEntryId : loserEntryId
    }

    const { status, data : submitResult } = await patchEntryMatch(requestBody);

    if( status === 200){
        const isAllMatchedCompleted = submitResult.allMatchedCompleted; // 모든 매치 완료 여부 ( boolean )

        // 처리 완료 시 -> 승리/패배 엔트리 애니메이션 시작
        winnerEntry.classList.add('winner');
        loserEntry.classList.add('loser');

        if( !isAllMatchedCompleted ){
            nextEntryMatch();
        } else {
            finishEntryMatch();
        }
    } else {
        handleTopicPlayException(submitResult);
    }
}

function nextEntryMatch(){
    setTimeout(async () =>{
        toggleMatchStageStatus(false);
        toggleEntrySlotClickBlock(false);
        await loadEntryMatchInfo();
    }, 2500);
}

function finishEntryMatch(){
    flushPlayRecordIdsFromLocalStorage(); // 로컬스토리지 내 식별자 비우기
    setTimeout(() =>{
        showToastMessage('모든 대결이 종료되었습니다. :)' , '', 2500);
    }, 1000);

    setTimeout(() =>{
        location.href = '/';
    }, 3000)
}

function toggleMatchStageStatus(isMatchDone){
    const matchStage = document.querySelector('#match-stage');

    isMatchDone ?
        matchStage.classList.add('match-done')
        : matchStage.classList.remove('match-done');
}

function toggleEntrySlotClickBlock(isBlock){
    const allEntries = document.querySelector('#match-stage').querySelectorAll('.entry-slot');

    allEntries.forEach((entrySlot) =>{
        isBlock ?
            entrySlot.classList.add('blocked')
            : entrySlot.classList.remove('blocked');

    });
}

function displayCurrentTournament(currentTournament){
    document.querySelector('#current-tournament').textContent = `<${currentTournament}>`;
}

async function getMatch(){
    return await apiGetRequest(`topics/play-records/${playRecord.getId()}/matches`);
}

async function patchEntryMatch(requestBody){
    return await apiPatchRequest(`topics/play-records/${playRecord.getId()}/matches/${match.getId()}`, {}, requestBody)
}