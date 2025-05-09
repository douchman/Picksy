import {apiRequest} from "../../../../../global/api/api.js";
import {createdTopic} from "../../../create/js/const.js";
import {ApiMethod} from "../../../../../global/api/api-method.js";

// 대결주제 생성
export async function createEntries(requestBody){
    const {status, data : entriesCreateResult, isAuthOrNetworkException } = await fetchCreateEntries(requestBody);

    if( isAuthOrNetworkException ) return null;

    if( status === 200 && entriesCreateResult ){ return entriesCreateResult; }

    return null;
}

// 엔트리 생성 API fetch
async function fetchCreateEntries(requestBody){
    return await apiRequest(`topics/${createdTopic.getId()}/entries`, ApiMethod.POST, requestBody, true);
}