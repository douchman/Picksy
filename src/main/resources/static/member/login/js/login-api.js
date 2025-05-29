import {apiRequest} from "../../../global/api/api.js";
import {ApiMethod} from "../../../global/api/api-method.js";

export async function memberLogin(requestBody){
    return await apiRequest('member/login', ApiMethod.POST, requestBody, false);
}
