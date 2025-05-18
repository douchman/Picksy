export function renderMyTopics(topicList){
    renderTopicCards(topicList);
}

function renderTopicCards(topicList){
    const isTopicListEmpty = !topicList || topicList.length === 0;

    if( isTopicListEmpty ) {
        toggleTopicCardsEmpty();
        return ;
    }

    const topicCards = document.querySelector('#topic-cards');

    topicList.forEach(topic => {
        const topicCard = /*html*/`
                         <div id="${topic.id}" class="topic-card">
                            <div class="topic-thumb" style="background-image: url('${topic.thumbnail}')"></div>
                            <div class="topic-meta">
                                <p class="title">${topic.title}</p>
                                <p class="subject">${topic.subject}</p>
                                <p class="description">${topic.description}</p>
                            </div>
                            <div class="btn-group">
                                <button class="btn-modify" type="button"></button>
                                <button class="btn-stats" type="button"></button>
                                <button class="btn-share" type="button"></button>
                            </div>
                        </div>`;

        topicCards.insertAdjacentHTML('beforeend',topicCard);
    });
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