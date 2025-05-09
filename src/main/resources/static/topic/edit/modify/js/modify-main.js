import {setupTopicSection, modifyTopic, registerTopic} from "./topic-section.js";
import {setupEntrySection, registerEntries} from "./entry-section.js";
import {showToastMessage} from "../../../../global/popup/js/common-toast-message.js";
import {createdTopic} from "../../core/js/const/const.js";
import {TopicEditExceptionHandler} from "../../core/js/exception/topic-edit-exception-handler.js";
import {TopicIdSaveException} from "../../core/js/exception/TopicEditException.js";

const topicEditExceptionHandler = new TopicEditExceptionHandler();

document.addEventListener('DOMContentLoaded', async () => {
    if(saveTopicId()){
        setupTopicSection();
        setupEntrySection();
        addBottomBtnGroupEvents();
    }
});

function saveTopicId(){
    const path = window.location.pathname;
    const segments = path.split('/');
    const topicId = Number(segments[segments.length - 1]);

    if ( !Number.isFinite(topicId) ){
        topicEditExceptionHandler.handle(new TopicIdSaveException());
        return false;
    }

    createdTopic.setId(topicId)
    return true;
}

function addBottomBtnGroupEvents(){
    document.querySelector('#btn-save').addEventListener('click' , async () => {
        let topicRegisterSuccess;

        toggleBtnSaveBlock(true);
        displayLoadingMask();

        if( createdTopic.isTopicCreated() ){
            topicRegisterSuccess = await modifyTopic();
        } else {
            topicRegisterSuccess = await registerTopic();
        }

        const entryRegisterSuccess =  topicRegisterSuccess && await registerEntries();

        if( topicRegisterSuccess && entryRegisterSuccess ){
            showToastMessage('성공적으로 저장되었습니다. :)');
            setTimeout(() =>{
                location.href = '/';
            }, 2000);
        } else{
            toggleBtnSaveBlock(false);
            removeLoadingMask();
        }
    });

    document.querySelector('#btn-cancel').addEventListener('click' , async () => {
        location.href = '/';
    });
}

function toggleBtnSaveBlock(isBlock){
    document.querySelector('#btn-save').disabled = isBlock;
}

function displayLoadingMask(){
    const loadingMask = `<div class="loading-mask"></div>`;
    document.querySelector('body').insertAdjacentHTML('beforeend', loadingMask);
}

function removeLoadingMask(){
    document.querySelector('.loading-mask').remove();
}