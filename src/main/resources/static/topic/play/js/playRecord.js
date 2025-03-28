import {apiGetRequest} from "../../../global/js/api.js";
import {playRecord, topic} from "./const.js";
import {showToastMessage} from "../../../global/popup/js/common-toast-message.js";

export async function loadEntryMatchInfo() {
    const {status, data: matchInfo} = await getMatch();

    if (status === 200) {

        const topicTitle = topic - title

    } else {
        showToastMessage('대결 정보 조회 중 문제가 생겼어요<br> 잠시 후 다시 시도해주세요', 'alert', 3000);
        setTimeout(() => {
            location.href = '/';
        }, 2000);
    }
}


async function getMatch(){
    return await apiGetRequest(`topics/play-records/${playRecord.getId()}/matches`);
}
