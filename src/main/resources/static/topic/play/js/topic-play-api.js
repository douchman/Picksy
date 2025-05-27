import {apiRequest} from "../../../global/api/api.js";
import {ApiMethod} from "../../../global/api/api-method.js";

// 대결주제 상세정보 조회
export async function getTopicDetail(topicId){
    return await apiRequest(`topics/${topicId}`, ApiMethod.GET, {}, false);
}

// 진행 할 대결 정보 조회
export async function getCurrentEntryMatch(playRecordId){
    return await apiRequest(`topics/play-records/${playRecordId}/matches`, ApiMethod.GET, {}, false);
}

// 엔트리 매치결과 제출
export async function submitMatchResult(playRecordId, matchId, requestBody){
    return await apiRequest(`topics/play-records/${playRecordId}/matches/${matchId}`,ApiMethod.PATCH, requestBody, false );
}