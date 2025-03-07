import {TOURNAMENT_DESC} from "./const.js";
import {apiGetRequest} from "../../global/js/api.js";

export function renderDialog(){
    const documentBody = document.querySelector('body');
    const tournamentSelectDialog = `<div id="tournament-select-dialog" class="tournament-select-dialog">
            <div class="bg"></div>
            <div class="dialog-body">
                <button id="btn-close-tournament-select-dialog" class="btn-close-tournament-select-dialog"  type="button"></button>
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
                    <button class="btn-start-match" type="button" disabled></button>
                    <button class="btn-cancel" type="button"></button>
                </div>
            </div>
        </div>`;

    documentBody.insertAdjacentHTML('beforeend', tournamentSelectDialog);
}

export function addDialogEvents() {

    // dialog 내부 커스텀 선택박스 -> 선택기 보임
    document.querySelector('#tournament-select').addEventListener('click', function () {
        toggleTournamentSelect(true);
    });

    // dialog 외부 배경화면 -> dialog 닫힘
    document.querySelector('#tournament-select-dialog .bg').addEventListener('click',closeTournamentSelectDialog);
    // dialog 닫기 버튼 -> dialog 닫힘
    document.querySelector('#btn-close-tournament-select-dialog').addEventListener('click', closeTournamentSelectDialog);

    // dialog 내부 토너먼트 선택기 이벤트
    document.querySelector('#tournament-items').addEventListener('click', function(event){
        const tournamentItem = event.target.closest('.tournament-item');
        if (tournamentItem) {
            event.stopPropagation(); // 부모 이벤트 버블 방지
            const tournamentStage = tournamentItem.dataset.tournamentstage;
            const selectedTournament = document.querySelector('#selected-tournament');
            const tournamentDesc = document.querySelector('#tournament-desc');

            selectedTournament.textContent = tournamentItem.textContent;
            tournamentDesc.textContent = TOURNAMENT_DESC[tournamentStage];
            toggleTournamentSelect(false);
        }
    });
}

export async function openTournamentSelectDialog(topicId){
    const dialog = document.querySelector('#tournament-select-dialog');
    const {topic, tournamentList } = await getTopicDetail(topicId);

    clearDialogData(dialog);

    dialog.querySelector('#topic-title').textContent= `${topic.title}`;
    dialog.querySelector('#topic-desc').textContent = `${topic.description}`;
    setTournamentSelector(tournamentList);
    dialog.classList.add('show');
}

function closeTournamentSelectDialog(){
    const dialog = document.querySelector('#tournament-select-dialog');
    dialog.classList.remove('show');
}

function clearDialogData(dialog){
    dialog.querySelector('#topic-title').textContent = '';
    dialog.querySelector('#topic-desc').textContent = '';
    dialog.querySelector('#tournament-select').classList.remove('active');
    dialog.querySelector('#selected-tournament').textContent = '토너먼트를 선택해 주세요.';
    dialog.querySelector('#tournament-desc').textContent = '';
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

async function getTopicDetail(topicId){
    return await apiGetRequest('topics/' +topicId, {}, false);
}
