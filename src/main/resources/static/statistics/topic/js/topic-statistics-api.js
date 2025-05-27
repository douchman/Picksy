import {apiRequest} from "../../../global/api/api.js";
import {ApiMethod} from "../../../global/api/api-method.js";

// 대결 주제 통계 조회
export async function getTopicStatistics(topicId){
    return await apiRequest(`statistics/topics/${topicId}`, ApiMethod.GET, {}, false);
}