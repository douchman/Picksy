import {apiGetRequest} from "../../../global/js/api.js";
import {topic} from "./const.js";

// 대결 주제 통계 조회
export async function getTopicStatistics(){
    return await apiGetRequest(`statistics/topics/${topic.getId()}`);
}