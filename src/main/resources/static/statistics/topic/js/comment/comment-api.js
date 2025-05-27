import {apiRequest} from "../../../../global/api/api.js";
import {ApiMethod} from "../../../../global/api/api-method.js";

export async function postComments(topicId, requestBody){
    return await apiRequest(`topics/${topicId}/comments`, ApiMethod.POST, requestBody, false);
}