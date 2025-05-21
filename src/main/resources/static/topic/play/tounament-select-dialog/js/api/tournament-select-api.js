import {apiRequest} from "../../../../../global/api/api.js";
import {ApiMethod} from "../../../../../global/api/api-method.js";

// 대결주제 상세정보( 토너먼트 정보 포함) 조회
export async function getTopicDetail(topicId){
    const { status, data : topicDetailResult, isAuthOrNetworkException } = await fetchTopicDetails(topicId);

    if(isAuthOrNetworkException) return null;

    if( status === 200 && topicDetailResult ){ return topicDetailResult }

    return null;
}

// 대결주제 상세정보(토너먼트 정보) 조회 API fetch
async function fetchTopicDetails(topicId){
    return await apiRequest(`topics/${topicId}`, ApiMethod.GET, {});
}


// 대결주제 시작 -> 서버에 알림 & playRecordId 식별자 반환
export async function getTopicPlayRecordId(topicId, tournamentStage){
    const { status, data : playRecordResult, isAuthOrNetworkException } = await fetchPlayRecord(topicId, tournamentStage);

    if( isAuthOrNetworkException ) return null;

    if( status === 200 && playRecordResult ){ return playRecordResult }

    return null;
}

// 대결시작 알림 API fetch
async function fetchPlayRecord(topicId, tournamentStage){
    return await apiRequest(`topics/${topicId}/play-records`, ApiMethod.POST, {tournamentStage});
}
