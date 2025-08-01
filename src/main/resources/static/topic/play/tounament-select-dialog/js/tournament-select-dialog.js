import {topicInfo, TOURNAMENT_DESC} from "./const/tournament-select-const.js";
import {toggleBodyScrollBlocked} from "../../../../global/layouts/js/layout-common.js";
import {TournamentSelectExceptionHandler} from "./exception/tounament-seelct-exception-handler.js";
import {getTopicDetail, getTopicPlayRecordId} from "./api/tournament-select-api.js";
import {loadEntryMatchInfo} from "../../js/entry-match.js";
import {playRecordStorage} from "../../js/const.js";
import {showToastMessage} from "../../../../global/toast-message/js/common-toast-message.js";
import {ModerationStatus, Visibility} from "../../../../global/const/const.js";

const tournamentSelectExceptionHandler = new TournamentSelectExceptionHandler();

/* 토너먼트 선택기 셋업 */
// 선택기 랜더링
// 선택기 이벤트 등록

export function setupTournamentSelectDialog(){
    renderDialog();
    addDialogEvents();
}

function renderDialog(){
    const documentBody = document.querySelector('body');
    const tournamentSelectDialog = `<div id="tournament-select-dialog" class="tournament-select-dialog">
            <div class="bg"></div>
            <div class="dialog-body">
                <div class="topic-desc-box">
                    <p id="topic-title" class="topic-title">대결 주제의 제목</p>
                    <p id="topic-desc" class="topic-desc">대결 주제 설명</p>
                </div>
                <div id="tournament-select" class="tournament-select">
                    <div id="selected-tournament" class="selected-tournament">선택된 토너먼트</div>
                    <ul id="tournament-items" class="tournament-items">
                        <li class="tournament-item">4강</li>
                        <li class="tournament-item">8강</li>
                    </ul>
                </div>
                <p id="tournament-desc" class="tournament-desc">선택된 토너먼트 설명</p>
                <div class="btn-group">
                    <button id="btn-start-match" class="btn-start-match" type="button" disabled></button>
                    <button id="btn-topic-stats" class="btn-topic-stats" type="button"></button>
                    <button id="btn-cancel-dialog" class="btn-cancel-dialog" type="button"></button>
                </div>
            </div>
        </div>`;

    documentBody.insertAdjacentHTML('beforeend', tournamentSelectDialog);
}

// 비밀번호 입력 UI 랜더링
function renderPasswordInput(){
    const tournamentSelect  = document.querySelector('#tournament-select');

    const passwordInputGroup =
        `<div class="password-input-group">
            <input id="topic-password" class="topic-password" type="text" placeholder="비밀번호 입력">
            <i class="txt-i">공개가 제한된 대결로 비밀번호를 입력이 필요합니다.</i>
        </div>`;

    tournamentSelect.insertAdjacentHTML('afterend', passwordInputGroup);

}

function addDialogEvents() {

    // dialog 내부 커스텀 선택박스 -> 선택기 보임
    document.querySelector('#tournament-select').addEventListener('click', function () {
        toggleTournamentSelect(true);
    });

    // dialog 취소 버튼 -> dialog 닫힘
    document.querySelector('#btn-cancel-dialog').addEventListener('click', backToHome);

    // dialog 내부 토너먼트 선택기 이벤트
    document.querySelector('#tournament-items').addEventListener('click', function(event){
        const tournamentItem = event.target.closest('.tournament-item');
        if (tournamentItem) {
            event.stopPropagation(); // 부모 이벤트 버블 방지
            const tournamentStage = tournamentItem.dataset.tournamentstage;
            const selectedTournament = document.querySelector('#selected-tournament');
            const tournamentDesc = document.querySelector('#tournament-desc');
            const btnStartMatch = document.querySelector('#btn-start-match');

            selectedTournament.textContent = tournamentItem.textContent;
            selectedTournament.dataset.tournamentStage = tournamentStage;
            tournamentDesc.classList.add('show');
            tournamentDesc.textContent = TOURNAMENT_DESC[tournamentStage];
            btnStartMatch.disabled = false;
            toggleTournamentSelect(false);
        }
    });

    // dialog 내부 시작 버튼
    document.querySelector('#btn-start-match').addEventListener('click', async () =>{
        await getPlayRecordIdAndStart();
    });

    // dialog 내부 통계 버튼
    document.querySelector('#btn-topic-stats').addEventListener('click', async () =>{
        location.href = `/statistics/topic/${topicInfo.id}`;
    });
}

export async function openTournamentSelectDialog(topicId){
    const dialog = document.querySelector('#tournament-select-dialog');
    dialog.setAttribute('data-topic-id', topicId);

    try {
        const topicDetailResult = await getTopicDetail(topicId);
        const topic = topicDetailResult.topic;
        const tournamentList = topicDetailResult.tournamentList;

        saveTopicId(topic.id); // 대결주제 id 저장
        clearDialogData(dialog);
        toggleBodyScrollBlocked(true);

        if(Visibility.PASSWORD === topic.visibility ) {
            renderPasswordInput();
        }

        if(isModerationPassed(topic.moderationStatus)){ // 필터 통과여부에 따라 이용제한 처리
            dialog.querySelector('#topic-title').textContent= `${topic.title}`;
            dialog.querySelector('#topic-desc').textContent = `${topic.description}`;
            setTournamentSelector(tournamentList);
            dialog.classList.add('show');
        } else{
            handleRestrictedTopic();
        }

    } catch(error){
        tournamentSelectExceptionHandler.handle(error, {context : 'topicDetail'});
    }
}

function closeTournamentSelectDialog(){
    const dialog = document.querySelector('#tournament-select-dialog');
    dialog.classList.remove('show');
    toggleBodyScrollBlocked(false);
}

function backToHome(){
    location.href = '/';
}

function clearDialogData(dialog){
    dialog.querySelector('#topic-title').textContent = '';
    dialog.querySelector('#topic-desc').textContent = '';
    dialog.querySelector('#tournament-select').classList.remove('active');
    dialog.querySelector('#selected-tournament').textContent = '토너먼트를 선택해 주세요.';
    dialog.querySelector('#tournament-desc').textContent = '';
    dialog.querySelector('#tournament-desc').classList.remove('show');
    dialog.querySelector('#btn-start-match').disabled = true;
}

function setTournamentSelector(tournamentList){
    const tournamentItems = document.querySelector('#tournament-items');
    tournamentItems.replaceChildren();
    tournamentList.forEach( tournament => {
        tournamentItems.insertAdjacentHTML('beforeend',`<li data-tournamentstage="${tournament.tournamentStage}" class="tournament-item">${tournament.tournamentName}</li>`);
    });
}

function toggleTournamentSelect(isOpen){
    document.querySelector('#tournament-select').classList.toggle('active', isOpen);
}

// 대결진행 식별자 조회 및 대결진행 시작
async function getPlayRecordIdAndStart(){
    const dialog = document.querySelector('#tournament-select-dialog');
    const tournamentStage = dialog.querySelector('#selected-tournament').dataset.tournamentStage;
    const topicPasswordInputEl = dialog.querySelector('#topic-password');
    const topicId = dialog.getAttribute('data-topic-id');

    const topicPassword = getValidTopicPassword(topicPasswordInputEl);

    if( topicPassword === null) return;

    try {
        const playRecordRequestPayload = {
            tournamentStage  : tournamentStage,
            accessCode  : topicPassword,
        }
        const playRecordResult = await getTopicPlayRecordId(topicId, playRecordRequestPayload);

        if(playRecordResult){
            closeTournamentSelectDialog();
            playRecordStorage.saveId(playRecordResult.playRecordId);
            await loadEntryMatchInfo(); // 선택 및 진행 식별값 반환이 완료되면 매치업 조회
        }
    } catch(error){
        tournamentSelectExceptionHandler.handle(error , {context : 'playRecordId'});
    }
}

// 입력된 비밀번호 추출
function getValidTopicPassword(topicPasswordEl){
    if(!topicPasswordEl) return '';
    const topicPassword = topicPasswordEl.value;

    if(!validateTopicPassword(topicPassword)) return null;
    return topicPassword
}

// 입력 비밀번호 검사
function validateTopicPassword(topicPassword){

    if( !topicPassword || topicPassword.length < 1) {
        showToastMessage({
            toastType: 'alert',
            title : '비밀번호',
            content : '비밀번호를 입력해 주세요'
        });
        return false;
    }

    return true;
}
// 필터 통과 여부 검사
function isModerationPassed(moderationStatus){
    return ModerationStatus.PASSED === moderationStatus;
}

// 이용 제한 대결주제 핸들
function handleRestrictedTopic(){
    showToastMessage({
        toastType: 'error',
        title : '제한된 표현이 포함된 대결',
        content : '제한된 표현이 포함되어있어 이용할 수 없는 대결주제입니다. 잠시 후 메인페이지로 돌아갑니다',
        delay : 5000
    });
    setTimeout(() => {
        location.href = '/';
    }, 4500);
}

function saveTopicId(topicId){
    topicInfo.id = topicId;
}