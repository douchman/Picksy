import { submitEntryMatchResult} from "./entry-match.js";

export function addEntrySlotClickEvents(entrySlot){
    const btnSelectEntry = entrySlot.querySelector('.btn-select-entry');

    entrySlot.addEventListener('click', async function(){
        await handleEntrySelectEvent(this);
    });

    btnSelectEntry.addEventListener('click', async function(event){
        event.stopPropagation(); // 부모 요소 이벤트 버블 방지
        await handleEntrySelectEvent(entrySlot);
    });
}

async function handleEntrySelectEvent(selectedEntry){
    toggleMatchStageStatus(true);
    handleEntrySlotClickBlock(true);
    const allEntries = selectedEntry.parentElement.querySelectorAll('.entry-slot');
    const winnerEntry = selectedEntry;
    const loserEntry = [...allEntries].find(entry => entry !== winnerEntry);

    await submitEntryMatchResult(winnerEntry, loserEntry, () => {
        toggleMatchStageStatus(false);
        handleEntrySlotClickBlock(false);
    });
}

function toggleMatchStageStatus(isMatchDone){
    const matchStage = document.querySelector('#match-stage');

    isMatchDone ?
        matchStage.classList.add('match-done')
        : matchStage.classList.remove('match-done');
}

function handleEntrySlotClickBlock(isBlock){
    const allEntries = document.querySelector('#match-stage').querySelectorAll('.entry-slot');

    allEntries.forEach((entrySlot) =>{
        isBlock ?
            entrySlot.classList.add('blocked')
            : entrySlot.classList.remove('blocked');

    });
}