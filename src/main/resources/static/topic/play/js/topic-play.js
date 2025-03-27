import topic from "./topic.js";
import playRecord from "./playRecord.js";
import {showToastMessage} from "../../../global/popup/js/common-toast-message";

document.addEventListener('DOMContentLoaded', async () => {
    setTopic();
    setPlayRecordId();
});

function setTopic(){
    const path = window.location.pathname;
    const segments = path.split('/');
    const topicId = segments[segments.length - 1];

    topic.setId(topicId);
}

function setPlayRecordId(){
    const storedPlayRecordIdName = `topic-${topic.getId()}-playRecord-id`;
    try {
        const playRecordId = localStorage.getItem(storedPlayRecordIdName);
        playRecord.setId(playRecordId);
    } catch(error) {
        showToastMessage('대결 진행 정보를 확인할 수 없어요 :(' , 'error', 3500);
        setTimeout(()=> {
            location.href = '/';
        }, 2500);
    } finally { // 처리 후 스토리지는 제거
        localStorage.removeItem(storedPlayRecordIdName);
    }
}