import {Visibility} from "../../../../../global/const/const.js";

export function toggleTopicPasswordGroupByVisibility(visibility){
    Visibility.PASSWORD === visibility ? showTopicPasswordGroup() : hideTopicPasswordGroup();
}

function showTopicPasswordGroup(){
    const topicPasswordGroup = document.querySelector('#topic-password-group');
    topicPasswordGroup.classList.add('show');
}

function hideTopicPasswordGroup(){
    const topicPasswordGroup = document.querySelector('#topic-password-group');
    const topicPassword = document.querySelector('#topic-password');
    topicPassword.value = '';
    topicPasswordGroup.classList.remove('show');
}