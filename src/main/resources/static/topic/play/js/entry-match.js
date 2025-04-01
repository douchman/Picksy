import {apiGetRequest, apiPatchRequest} from "../../../global/js/api.js";
import {match, playRecord} from "./const.js";

// 엔트리 대진표 조회
export async function getMatch(){
    return await apiGetRequest(`topics/play-records/${playRecord.getId()}/matches`);
}

// 엔트리 대결 결과 제출
export async function submitEntryMatchResult(winnerEntryId, loserEntryId){
    const requestBody = {
        winnerEntryId : winnerEntryId,
        loserEntryId : loserEntryId
    }

    return await patchEntryMatch(requestBody);
}

async function patchEntryMatch(requestBody){
    return await apiPatchRequest(`topics/play-records/${playRecord.getId()}/matches/${match.getId()}`, {}, requestBody)
}