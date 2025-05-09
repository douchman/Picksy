import {setupTopicSection, modifyTopic, registerTopic} from "./topic-section.js";
import {setupEntrySection, registerEntries} from "./entry-section.js";
import {showToastMessage} from "../../../../global/popup/js/common-toast-message.js";
import {createdTopic} from "../../core/js/const/const.js";

document.addEventListener('DOMContentLoaded', () => {
    setupTopicSection();
    setupEntrySection();
    addBottomBtnGroupEvents();
});


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