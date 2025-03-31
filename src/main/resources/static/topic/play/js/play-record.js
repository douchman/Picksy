import {showToastMessage} from "../../../global/popup/js/common-toast-message.js";
import {renderEntriesAndAddEvents} from "./entry-renderer.js";
import {getMatch} from "./entry-match.js";
import {match} from "./const.js";

export async function loadEntryMatchInfo() {
    const {status, data: matchInfo} = await getMatch();

    if (status === 200) {
        const matchId = matchInfo.matchId;
        const currentTournament = matchInfo.currentTournament;
        const entryMatch = matchInfo.entryMatch;

        match.setId(matchId);
        renderCurrentTournament(currentTournament);
        renderEntriesAndAddEvents(entryMatch);
    } else {
        handleEntryMatchInfoException(matchInfo);
    }
}

function renderCurrentTournament(currentTournament){
    document.querySelector('#current-tournament').textContent = `<${currentTournament}>`;
}

function handleEntryMatchInfoException(matchInfo){
    const errorCode = matchInfo.errorCode;
    const message = matchInfo.message;

    showToastMessage(`${message}`, 'alert', 3000);
    setTimeout(() => {
        location.href = '/';
    }, 2000);
}