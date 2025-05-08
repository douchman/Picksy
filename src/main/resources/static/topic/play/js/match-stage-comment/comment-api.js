
import {apiRequest} from "../../../../global/api/api.js";
import {ApiMethod} from "../../../../global/api/api-method.js";


// 댓글 조회
export async function getComments(topicId, requestBody){
    const {status, data : commentResult, isAuthOrNetworkException } = await fetchCommentList(topicId, requestBody);

    if( isAuthOrNetworkException ) return null;

    if( status === 200 && commentResult ){ return commentResult; }

    return null;
}

// 댓글 조회 API fetch
async function fetchCommentList(topicId, requestBody){
    return await apiRequest(`topics/${topicId}/comments`, ApiMethod.GET, requestBody, false);
}