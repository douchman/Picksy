import {apiRequest} from "../../../../global/api/api.js";
import {ApiMethod} from "../../../../global/api/api-method.js";

// 내가 생성한 대결주제 조회
export async function getMyTopic(requestBody){
    return await apiRequest('my/topics' , ApiMethod.GET, requestBody, false);
}