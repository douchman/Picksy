import {apiRequest} from "../../../../global/api/api.js";
import {ApiMethod} from "../../../../global/api/api-method.js";

// 댓글 조회
export async function getComments(topicId, requestBody){
    return await apiRequest(`topics/${topicId}/comments`, ApiMethod.GET, requestBody, false);
}

// 댓글 작성
export async function createComment(topicId, requestBody){
    return await apiRequest(`topics/${topicId}/comments`, ApiMethod.POST, requestBody);
}

