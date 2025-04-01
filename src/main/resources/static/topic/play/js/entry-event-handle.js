import {loadEntryMatchInfo, submitEntryMatchResult} from "./entry-match.js";
import {handleTopicPlayException} from "./exceptionHandler.js";

export function addEntrySlotClickEvents(entrySlot){
    const btnSelectEntry = entrySlot.querySelector('.btn-select-entry');

    entrySlot.addEventListener('click', async function(event){
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
    const winnerEntryId = winnerEntry.dataset.id;
    const loserEntryId = loserEntry.dataset.id;

    const { status, data : submitResult } = await submitEntryMatchResult(winnerEntryId, loserEntryId)

    if( status === 200){
        const allMatchedCompleted = submitResult.allMatchedCompleted; // 모든 매치 완료 여부 ( boolean )

        // 처리 완료 시 승리/패배 엔트리 애니메이션 시작
        winnerEntry.classList.add('winner');
        loserEntry.classList.add('loser');
        setTimeout(async () =>{
            if( !allMatchedCompleted ){
                toggleMatchStageStatus(false);
                handleEntrySlotClickBlock(false);
                await loadEntryMatchInfo();
            }
        }, 2000)
    } else {
        handleTopicPlayException(submitResult);
    }
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