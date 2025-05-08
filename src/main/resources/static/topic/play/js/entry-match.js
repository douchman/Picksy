import { apiPatchRequest} from "../../../global/js/api.js";
import {match, playRecord} from "./const.js";
import {renderEntriesAndAddEvents} from "./entry-render.js";
import {handleTopicPlayException} from "./exceptionHandler.js";
import {finishEntryMatch} from "./entry-match-finish.js";
import {getCurrentEntryMatch} from "./topic-play-api.js";
import {TopicPlayExceptionHandler} from "./exception/topic-play-exception-handler";
import {CurrentEntryMatchException} from "./exception/TopicPlayException";

const topicPlayExceptionHandler = new TopicPlayExceptionHandler();

// 엔트리 대진표 조회
export async function loadEntryMatchInfo() {
    const currentEntryMatchResult = await getCurrentEntryMatch(playRecord.getId());

    if (currentEntryMatchResult) {
        const matchId = currentEntryMatchResult.matchId;
        const currentTournament = currentEntryMatchResult.currentTournament;
        const entryMatch = currentEntryMatchResult.entryMatch;

        match.setId(matchId);
        displayCurrentTournament(currentTournament);
        renderEntriesAndAddEvents(entryMatch);
    } else {
        handleTopicPlayException(currentEntryMatchResult);
        topicPlayExceptionHandler.handle(new CurrentEntryMatchException(currentEntryMatchResult.message))
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

// 다음 매치업 준비
function nextEntryMatch(){
    setTimeout(async () =>{
        toggleMatchStageStatus(false);
        toggleEntrySlotClickBlock(false);
        await loadEntryMatchInfo();
    }, 2500);
}


// 매치 스테이지 종료 상태 토글
function toggleMatchStageStatus(isMatchDone){
    const matchStage = document.querySelector('#match-stage');

    isMatchDone ?
        matchStage.classList.add('match-done')
        : matchStage.classList.remove('match-done');
}

// 엔트리 선택 잠금 상태 토글
function toggleEntrySlotClickBlock(isBlock){
    const allEntries = document.querySelector('#match-stage').querySelectorAll('.entry-slot');

    allEntries.forEach((entrySlot) =>{
        isBlock ?
            entrySlot.classList.add('blocked')
            : entrySlot.classList.remove('blocked');

    });
}

// 현재 토너먼트 라운드 표시(업데이트)
function displayCurrentTournament(currentTournament){
    document.querySelector('#current-tournament').textContent = `<${currentTournament}>`;
}

// 대결 결과 제출
async function patchEntryMatch(requestBody){
    return await apiPatchRequest(`topics/play-records/${playRecord.getId()}/matches/${match.getId()}`, {}, requestBody)
}