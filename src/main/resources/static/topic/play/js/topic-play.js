import {topic, playRecord} from "./const.js";
import {showToastMessage} from "../../../global/popup/js/common-toast-message.js";
import {apiGetRequest} from "../../../global/js/api.js";
import {loadEntryMatchInfo} from "./entry-match.js";
import {flushPlayRecordIdsFromLocalStorage} from "../../../global/js/vstopic-localstorage.js";

document.addEventListener('DOMContentLoaded', async () => {

    addPlayRecordIdFlushEventOnUnload();
    const topicSuccess  = await saveTopicInfo(); // 대결주제 식별자 변수화
    const playRecordSuccess = savePlayRecordInfo(); // 대결진행기록 식별자 변수화

    if( topicSuccess && playRecordSuccess){
        loadYoutubeIframeAPI();
    }

    // 유튜브 API 로드 후 호출되는 전역 함수
    window.onYouTubeIframeAPIReady = async () => {
        if( topicSuccess && playRecordSuccess){
            addTopicPlayEvents();
            await loadEntryMatchInfo();
        }
    };
});

function addTopicPlayEvents(){

    document.querySelector('#btn-back').addEventListener('click', () =>{
        location.href = '/';
    });
}

async function saveTopicInfo(){
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

function savePlayRecordInfo(){
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
    } finally {
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

function loadYoutubeIframeAPI(){
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

/**
 * 새로고침을 제외한 페이지 이탈 시 로컬스토리지 비우기
 */
function addPlayRecordIdFlushEventOnUnload(){
    window.addEventListener('beforeunload', () => {
        //event.preventDefault();
        const navigationType = performance.getEntries()[0].type;
        const isReload = navigationType === 'reload';
        if(!isReload){
            flushPlayRecordIdsFromLocalStorage();
        }
    });
}