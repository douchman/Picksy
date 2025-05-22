import {Visibility} from "../../../../global/js/const.js";

export function renderMyTopics(topicList){
    renderTopicCards(topicList);
}

function renderTopicCards(topicList){
    const isTopicListEmpty = !topicList || topicList.length === 0;

    if( isTopicListEmpty ) {
        toggleTopicCardsEmpty(true);
        return ;
    }

    toggleTopicCardsEmpty(false);
    const topicCards = document.querySelector('#topic-cards');

    topicList.forEach(topic => {
        const topicCard = /*html*/`
                         <div id="${topic.id}" class="topic-card" data-action="play">
                            ${renderVisibilityLabel(topic.visibility)}
                            <div class="topic-thumb" style="background-image: url('${topic.thumbnail}')"></div>
                            <div class="topic-meta">
                                <p class="title">${topic.title}</p>
                                <p class="subject">${topic.subject}</p>
                                <p class="description">${topic.description}</p>
                            </div>
                            <div class="btn-group">
                                <button class="btn-modify" data-action="modify" type="button"></button>
                                <button class="btn-stats" data-action="stats" type="button"></button>
                                ${renderShareButton(topic.visibility)}
                            </div>
                        </div>`;

        topicCards.insertAdjacentHTML('beforeend',topicCard);
    });
}

// 공개범위 라벨 랜더
function renderVisibilityLabel(visibility){
    let visibilityClass = '';

    switch (visibility){
        case Visibility.PUBLIC:
            visibilityClass = 'public';
            break;
        case Visibility.PRIVATE:
            visibilityClass = 'private';
            break;
        case Visibility.UNLISTED:
            visibilityClass = 'unlisted';
            break;
    }

    const visibilityName = Visibility.getVisibilityName(visibility);

    return `<label class="visibility-label ${visibilityClass}">${visibilityName}</label>`
}

// 공유버튼 랜더링
function renderShareButton(visibility){
    if( Visibility.PRIVATE !== visibility ) {
        return '<button class="btn-share" data-action="share" type="button"></button>';
    }
    return '';
}


// 표시 컨텐츠 비었음으로 상태 변경
function toggleTopicCardsEmpty(isEmpty = false){
    const topicCards = document.querySelector('#topic-cards');
    isEmpty ?
        topicCards.classList.add('empty')
        : topicCards.classList.remove('empty');
}

// 표시 컨텐츠 랜더링 영역 비우기
export function clearTopicCardsContents(){
    const topicCards = document.querySelector('#topic-cards');
    topicCards.replaceChildren();
}