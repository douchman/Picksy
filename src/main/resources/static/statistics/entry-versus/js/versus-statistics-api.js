import {apiRequest} from "../../../global/api/api.js";
import {ApiMethod} from "../../../global/api/api-method.js";

export async function getTargetEntryStatistics(topicId, entryId){
    return await apiRequest(`statistics/topics/${topicId}/entries/${entryId}`, ApiMethod.GET, {}, false);
}