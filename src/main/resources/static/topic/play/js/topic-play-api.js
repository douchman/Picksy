import {apiRequest} from "../../../global/api/api.js";
import {ApiMethod} from "../../../global/api/api-method.js";

// 대결주제 상세정보 조회
export async function getTopicDetail(topicId){
    return await apiRequest(`topics/${topicId}`, ApiMethod.GET, {}, false);
}

// 진행 할 대결 정보 조회
export async function getCurrentEntryMatch(playRecordId){
    const {status, data : currentEntryMatchResult, isAuthOrNetworkException} =  await fetchCurrentEntryMatch(playRecordId);

    if( isAuthOrNetworkException ) return null;

    if( status === 200 && currentEntryMatchResult ){ return currentEntryMatchResult; }

    return null;
}

// 진행 할 대결조회 API fetch
async function fetchCurrentEntryMatch(playRecordId){
    return await apiRequest(`topics/play-records/${playRecordId}/matches`, ApiMethod.GET, {}, false);
}

// 엔트리 매치결과 제출
export async function submitMatchResult(playRecordId, matchId, requestBody){
    const {status, data : entryMatchSubmitResult, isAuthOrNetworkException} = await fetchMatchResult(playRecordId, matchId, requestBody);

    if( isAuthOrNetworkException ) return null;

    if( status === 200 && entryMatchSubmitResult ){ return entryMatchSubmitResult; }

    return null;
}

// 엔트리 매치 결과 제출 API fetch
async function fetchMatchResult(playRecordId, matchId, requestBody){
    return await apiRequest(`topics/play-records/${playRecordId}/matches/${matchId}`,ApiMethod.PATCH, requestBody, false );
}
