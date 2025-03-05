import {apiGetRequest} from '../../global/js/api.js';
import {addDialogEvents, renderDialog, displayDialog} from "./tournament-select-dialog.js";

document.addEventListener('DOMContentLoaded', async () => {
    await renderTopics();
    addTopicCardEvents();
    renderDialog();
    addDialogEvents();

});

function addTopicCardEvents(){
    // 랜더링 된 대결 주제 카드 이벤트 -> 토너먼트 선택기 오픈
    document.body.addEventListener('click', function(event) {
        if (event.target.closest('.topic-content-card')) {
            displayDialog(true); // show
        }
    });
}

async function getTopics(){
    return await apiGetRequest('topics', {} , false);
}

async function renderTopics(){
    const topicContentCards = document.querySelector('#topic-content-cards');
    const {topicList} = await getTopics();

    clearTopicContentCards();

    topicList.forEach( topic => {
        const topicContentCard =
            `
            <div class="topic-content-card">
                        <div class="topic-thumb-group"></div>
                        <div class="topic-desc-group">
                            <p class="topic-title">${topic.title}</p>
                            <p class="topic-subject">${topic.subject}</p>
                            <p class="topic-desc">${topic.description}</p>
                        </div>
                        <div class="btn-group">
                            <button class="btn-topic-stats" type="button"></button>
                            <button class="btn-topic-share" type="button"></button>
                        </div>
                    </div>
            `;
        topicContentCards.insertAdjacentHTML('beforeend', topicContentCard);
    });
}

/**
 * 대결주제 카드가 랜더링 대상(topic-content-cards) 비우기
 */
function clearTopicContentCards(){
    const topicContentCards = document.querySelector('#topic-content-cards');
    topicContentCards.replaceChildren();
}