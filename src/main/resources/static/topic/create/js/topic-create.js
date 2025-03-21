import {addTopicCreateEvents, registerTopic} from "./l-topic-create.js";
import {addEntryCreateEvents, registerEntries} from "./r-entry-create.js";

document.addEventListener('DOMContentLoaded', () => {
    addTopicCreateEvents();
    addEntryCreateEvents();
    addTopicCrateEvents();
});


function addTopicCrateEvents(){
    document.querySelector('#btn-save').addEventListener('click' , async () => {

        registerTopic().then(() =>{
            registerEntries();
        })

    });

    document.querySelector('#btn-cancel').addEventListener('click' , async () => {
        location.href = '/';
    });
}