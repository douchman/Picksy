import {apiRequest} from "../../api/api.js";
import {ApiMethod} from "../../api/api-method.js";

export async function createInquiry(requestBody){
    return await apiRequest(`inquiry`, ApiMethod.POST, requestBody);
}