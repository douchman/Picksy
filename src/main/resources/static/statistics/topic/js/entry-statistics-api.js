import {apiGetRequest} from "../../../global/js/api.js";
import {topic} from "./const.js";

export async function getEntryStatistics(requestBody){
    return await apiGetRequest(`statistics/topics/${topic.getId()}/entries`, {}, requestBody);
}