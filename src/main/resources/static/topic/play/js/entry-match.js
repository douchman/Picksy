import {apiGetRequest, apiPatchRequest} from "../../../global/js/api.js";
import {match, playRecord} from "./const.js";
import {renderEntriesAndAddEvents} from "./entry-render.js";
import {handleTopicPlayException} from "./exceptionHandler.js";

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
export async function submitEntryMatchResult(winnerEntry, loserEntry, callBack){

    const winnerEntryId = winnerEntry.dataset.id;
    const loserEntryId = loserEntry.dataset.id;

    const requestBody = {
        winnerEntryId : winnerEntryId,
        loserEntryId : loserEntryId
    }

    const { status, data : submitResult } = await patchEntryMatch(requestBody);

    if( status === 200){
        const isAllMatchedCompleted = submitResult.allMatchedCompleted; // 모든 매치 완료 여부 ( boolean )

        // 처리 완료 시 승리/패배 엔트리 애니메이션 시작
        winnerEntry.classList.add('winner');
        loserEntry.classList.add('loser');

        setTimeout(async () =>{
            if( !isAllMatchedCompleted ){
                    typeof callBack === 'function' && callBack();
                    await loadEntryMatchInfo();
            } else {
                   location.href = '/';
            }
        }, 2500)
    } else {
        handleTopicPlayException(submitResult);
    }
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