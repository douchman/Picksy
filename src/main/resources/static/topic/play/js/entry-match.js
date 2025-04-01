import {apiGetRequest, apiPatchRequest} from "../../../global/js/api.js";
import {match, playRecord} from "./const.js";
import {renderEntriesAndAddEvents} from "./entry-renderer.js";
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

    return  await getMatch();
}

// 엔트리 대결 결과 제출
export async function submitEntryMatchResult(winnerEntryId, loserEntryId){
    const requestBody = {
        winnerEntryId : winnerEntryId,
        loserEntryId : loserEntryId
    }

    return await patchEntryMatch(requestBody);
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