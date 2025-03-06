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
            </div>
        </div>`;

    documentBody.insertAdjacentHTML('beforeend', tournamentSelectDialog);
}

export function addDialogEvents() {

    // dialog 내부 커스텀 선택박스 -> 선택기 보임
    document.querySelector('#tournament-select').addEventListener('click', function () {
        this.classList.add('active');
    });

    // dialog 외부 배경화면 -> dialog 닫힘
    document.querySelector('#tournament-select-dialog .bg').addEventListener('click',closeTournamentSelectDialog);
    // dialog 닫기 버튼 -> dialog 닫힘
    document.querySelector('#btn-close-tournament-select-dialog').addEventListener('click', closeTournamentSelectDialog);
}


export function displayDialog(show = false) {
    const dialog = document.querySelector('#tournament-select-dialog');
    const topicTitle = dialog.querySelector('#topic-title');
    const topicDesc = dialog.querySelector('#topic-desc');
    const selectedTournament = dialog.querySelector('#selected-tournament');
    if (show) {
        dialog.classList.add('show');
    } else {
        topicTitle.innerHTML = '';
        topicDesc.innerHTML = '';
        selectedTournament.innerHTML = '토너먼트를 선택해 주세요.';
        dialog.classList.remove('show');
    }
}

export async function openTournamentSelectDialog(){
    const dialog = document.querySelector('#tournament-select-dialog');
    dialog.classList.add('show');
}

function closeTournamentSelectDialog(){
    const dialog = document.querySelector('#tournament-select-dialog');
    const topicTitle = dialog.querySelector('#topic-title');
    const topicDesc = dialog.querySelector('#topic-desc');
    const selectedTournament = dialog.querySelector('#selected-tournament');

    topicTitle.innerHTML = '';
    topicDesc.innerHTML = '';
    selectedTournament.innerHTML = '토너먼트를 선택해 주세요.';
    dialog.classList.remove('show');
}