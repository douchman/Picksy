import {apiRequest} from "../../global/api/api.js";
import {ApiMethod} from "../../global/api/api-method.js";

export async function getNotice(requestParams){
    return await apiRequest('notices', ApiMethod.GET, requestParams);
}