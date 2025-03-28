import {apiGetRequest} from "../../../global/js/api.js";
import {playRecord, topic} from "./const.js";
import {showToastMessage} from "../../../global/popup/js/common-toast-message.js";

export async function loadEntryMatchInfo() {
    const {status, data: matchInfo} = await getMatch();

    if (status === 200) {
        const currentTournament = matchInfo.currentTournament;
        renderCurrentTournament(currentTournament);
    } else {
        handleEntryMatchInfoException(matchInfo);
    }
}

function renderCurrentTournament(currentTournament){
    document.querySelector('#current-tournament').textContent = `<${currentTournament}>`;
}

async function getMatch(){
    return await apiGetRequest(`topics/play-records/${playRecord.getId()}/matches`);
}

function handleEntryMatchInfoException(matchInfo){
    const errorCode = matchInfo.errorCode;
    const message = matchInfo.message;

    showToastMessage(`${message}`, 'alert', 3000);
    setTimeout(() => {
        location.href = '/';
    }, 2000);
}