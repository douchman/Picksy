import {apiRequest} from "../../global/api/api.js";
import {ApiMethod} from "../../global/api/api-method.js";

// 대결 주제 검색
export async function searchTopics(requestParams){
    return await apiRequest('topics', ApiMethod.GET, requestParams);
}
