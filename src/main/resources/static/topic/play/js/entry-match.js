import {apiGetRequest, apiPatchRequest} from "../../../global/js/api.js";
import {match, playRecord} from "./const.js";

export async function getMatch(){
    return await apiGetRequest(`topics/play-records/${playRecord.getId()}/matches`);
}

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