import {addTopicCreateEvents, registerTopic} from "./l-topic-create.js";
import {addEntryCreateEvents, registerEntries} from "./r-entry-create.js";

document.addEventListener('DOMContentLoaded', () => {
    addTopicCreateEvents();
    addEntryCreateEvents();
    addTopicCrateEvents();
});


function addTopicCrateEvents(){
    document.querySelector('#btn-save').addEventListener('click' , async () => {

        const topicRegisterSuccess = await registerTopic()
        const entryRegisterSuccess =  topicRegisterSuccess && await registerEntries();

        if( entryRegisterSuccess ){
            alert('등록이 완료되었습니다.');
            location.href = '/';
        }
    });

    document.querySelector('#btn-cancel').addEventListener('click' , async () => {
        location.href = '/';
    });
}