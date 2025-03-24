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

        entryRegisterSuccess && alert('등록 완료'); // 임시

    });

    document.querySelector('#btn-cancel').addEventListener('click' , async () => {
        location.href = '/';
    });
}