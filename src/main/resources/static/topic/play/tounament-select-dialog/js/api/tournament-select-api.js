import {apiRequest} from "../../../../../global/api/api.js";
import {ApiMethod} from "../../../../../global/api/api-method.js";

// 대결주제 상세정보( 토너먼트 정보 포함) 조회
export async function getTopicDetail(topicId){
    return await apiRequest(`topics/${topicId}/tournaments`, ApiMethod.GET, {});
}

// 대결주제 시작 -> 서버에 알림 & playRecordId 식별자 반환
export async function getTopicPlayRecordId(topicId, requestBody){
    return await apiRequest(`topics/${topicId}/play-records`, ApiMethod.POST, requestBody);
}
