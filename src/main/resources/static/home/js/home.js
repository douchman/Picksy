document.addEventListener('DOMContentLoaded', async () => {
    await renderTopics();
});

async function getTopics( ){
    const response = await fetch( 'http://localhost:8080/topics',{
        method : 'GET',
        cache : 'no-cache',
        credentials : 'include'
    });

    const {data} = await response.json();

    return data;
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