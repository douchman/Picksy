import {apiGetRequest} from "../../../global/js/api.js";
import {playRecord} from "./const.js";

export async function getMatch(){
    return await apiGetRequest(`topics/play-records/${playRecord.getId()}/matches`);
}