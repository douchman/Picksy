import {apiRequest} from "../../../global/api/api.js";
import {ApiMethod} from "../../../global/api/api-method.js";

export async function getEntryStatistics(topicId, requestBody){
    return await apiRequest(`statistics/topics/${topicId}/entries`, ApiMethod.GET, requestBody, false);
}