import {apiRequest} from "../../../../../global/api/api.js";
import {ApiMethod} from "../../../../../global/api/api-method.js";

// 업로드 url 생성
export async function getPrSignedUploadUrl(requestBody){
    return apiRequest('uploads/presigned-url', ApiMethod.POST, requestBody, false);
}
