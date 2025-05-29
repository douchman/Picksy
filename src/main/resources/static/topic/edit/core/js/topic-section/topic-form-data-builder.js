import {showToastMessage} from "../../../../../global/toast-message/js/common-toast-message.js";
import {isModifiedTopic} from "../const/initial-topic.js";

export function buildValidatedTopicRegisterFormData(){

    const { title, subject, description, thumbnail, visibility}  = getTopicInputValues();

    if(!title || title === ''){
        showToastMessage('대결 제목을 입력해주세요', 'alert');
        return {validationResult : false, formData : {}}
    }

    if(!subject || subject === ''){
        showToastMessage('주요개념을 입력해주세요', 'alert');
        return {validationResult : false, formData : {}}
    }

    if(!description || description === ''){
        showToastMessage('대결 설명을 입력해주세요', 'alert');
        return {validationResult : false, formData : {}}
    }

    if(!thumbnail){
        showToastMessage('대표이미지를 등록해주세요', 'alert');
        return {validationResult : false, formData : {}}
    }

    const topicRegisterFormData = new FormData();
    topicRegisterFormData.append('title', title)
    topicRegisterFormData.append('subject', subject)
    topicRegisterFormData.append('description', description)
    topicRegisterFormData.append('thumbnail', thumbnail)
    topicRegisterFormData.append('visibility', visibility)

    return { validationResult : true, formData:  topicRegisterFormData };
}

export function buildValidatedTopicUpdateFormData(){

    const { title, subject, description, thumbnail, visibility}  = getTopicInputValues();

    if(!title || title === ''){
        showToastMessage('대결 제목을 입력해주세요', 'alert');
        return {validationResult : false, formData : {}}
    }

    if(!subject || subject === ''){
        showToastMessage('주요개념을 입력해주세요', 'alert');
        return {validationResult : false, formData : {}}
    }

    if(!description || description === ''){
        showToastMessage('대결 설명을 입력해주세요', 'alert');
        return {validationResult : false, formData : {}}
    }

    const currentData = {
        title,
        subject,
        description,
    }

    if( !isModifiedTopic(currentData) ){ return { validationResult : true, formData : null} }

    const topicModifyFormData = new FormData();
    topicModifyFormData.append('title', title)
    topicModifyFormData.append('subject', subject)
    topicModifyFormData.append('description', description)
    thumbnail && topicModifyFormData.append('thumbnail', thumbnail)
    topicModifyFormData.append('visibility', visibility)

    return { validationResult : true, formData:  topicModifyFormData };
}

function getTopicInputValues(){
    const title = document.querySelector('#topic-title').value;
    const subject = document.querySelector('#topic-subject').value;
    const description = document.querySelector('#topic-desc').value;
    const thumbnail = document.querySelector('#topic-thumbnail').files[0];
    const visibility = document.querySelector('input[name="visibility"]:checked')?.value;

    return {
        title,
        subject,
        description,
        thumbnail,
        visibility
    };
}