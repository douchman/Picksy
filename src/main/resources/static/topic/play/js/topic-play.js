import {topic, playRecord} from "./const.js";
import {showToastMessage} from "../../../global/popup/js/common-toast-message.js";
import {loadEntryMatchInfo} from "./playRecord.js";
import {apiGetRequest} from "../../../global/js/api.js";

document.addEventListener('DOMContentLoaded', async () => {
    const topicSuccess  = await setTopic(); // 대결주제 식별자 변수화
    const playRecordSuccess = setPlayRecordId(); // 대결진행기록 식별자 변수화

    if( topicSuccess && playRecordSuccess){
        await loadEntryMatchInfo();
    }
});

async function setTopic(){
    const path = window.location.pathname;
    const segments = path.split('/');
    const topicId = segments[segments.length - 1];

    topic.setId(topicId);

    const { status, data : topicDetail } = await getTopicDetail();
    if ( status === 200){
        topic.setTitle(topicDetail.topic.title);
        renderTopicTitle();
    } else {
        handleSetTopicFailed();
        return false;
    }

    return true;
}

function setPlayRecordId(){
    const storedPlayRecordIdName = `topic-${topic.getId()}-playRecord-id`;
    try {
        const playRecordId = localStorage.getItem(storedPlayRecordIdName);

        if( !playRecordId ){
            handleSetPlayRecordIdFailed();
        } else {
            playRecord.setId(playRecordId);
        }
    } catch(error) {
        handleSetPlayRecordIdFailed();
    } finally { // 처리 후 스토리지는 제거
        localStorage.removeItem(storedPlayRecordIdName);
    }

    return true;
}

function renderTopicTitle(){
    document.querySelector('title').textContent = topic.getTitle();
    document.querySelector('#topic-title').textContent = topic.getTitle();
}

async function getTopicDetail(){
    return await apiGetRequest(`topics/${topic.getId()}`);
}

function handleSetPlayRecordIdFailed(){
    showToastMessage('대결 진행 정보를 확인할 수 없어요 :(' , 'error', 3500);
    setTimeout(()=> {
        location.href = '/';
    }, 2500);
}

function handleSetTopicFailed(){
    showToastMessage('대결 정보를 확인할 수 없어요 :(' , 'error', 3500);
    setTimeout(()=> {
        location.href = '/';
    }, 2500);
}