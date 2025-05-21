import {apiRequest} from "../../../../global/api/api.js";
import {ApiMethod} from "../../../../global/api/api-method.js";

// 내가 생성한 대결주제 조회
export async function getMyTopic(requestBody){
    const { status, data : myTopicResult, isAuthOrNetworkException } = await fetchMyTopic(requestBody);

    if( isAuthOrNetworkException)  return null;

    if( status === 200 && myTopicResult ) return myTopicResult;

    return null;
}

// 내가 생성한 대결주제 조회 API fetch
async function fetchMyTopic(requestBody){
    return await apiRequest('my/topics' , ApiMethod.GET, requestBody, false);
}