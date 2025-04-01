import {renderEntriesAndAddEvents} from "./entry-renderer.js";
import {getMatch} from "./entry-match.js";
import {match} from "./const.js";
import {handleTopicPlayException} from "./exceptionHandler.js";

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
        handleTopicPlayException(matchInfo);
    }
}

function renderCurrentTournament(currentTournament){
    document.querySelector('#current-tournament').textContent = `<${currentTournament}>`;
}
