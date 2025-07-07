import {setupMatchStageComment} from "../match-stage-comment/js/match-stage-comment.js";
import {flushPlayRecordIdsFromLocalStorage} from "../../../global/global.js";

// 매치 종료
export function finishEntryMatch(){
    setTimeout(() =>{
        removeLoserEntrySlot(); // 패배한 엔트리 슬롯 제거
        setupWinnerEntry(); // 승리한 엔트리 셋업
        setupMatchStageComment(); // 대결주제 유저 코멘트 랜더링
        flushPlayRecordIdsFromLocalStorage(); // 대결 진행 완료 후 로컬 스토리지 비우기
    }, 2000);

}

/**
 * 승리한 엔트리 셋업
 * - winner class 제거 -> 스타일 조정
 * - 불필요한 UI 제거
 * - 승리 엔트리 인덱스 랜더링
 */
function setupWinnerEntry(){
    const winnerEntry = document.querySelector('.entry-slot.winner');
    winnerEntry.classList.remove('winner');
    winnerEntry.classList.add('winner-entry');
    winnerEntry.querySelector('.btn-select-entry').remove();
    renderWinnerEntryIndex();
}

// 승리 엔트리 인덱스 랜더링
function renderWinnerEntryIndex(){
    const winnerEntry = document.querySelector('.entry-slot.winner-entry');
    const winnerEntryIndex =
        `<p class="winner-entry-index">&lt;우승 엔트리&gt;</p>`;

    winnerEntry.insertAdjacentHTML('afterbegin', winnerEntryIndex);
}

// 패배한 엔트리 제거
function removeLoserEntrySlot(){
    document.querySelector('.entry-slot.loser').remove();
}