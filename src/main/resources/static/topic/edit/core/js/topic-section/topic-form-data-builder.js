import {showToastMessage} from "../../../../../global/popup/js/common-toast-message.js";
import {isModifiedTopic} from "../const/initial-topic";

export function buildValidatedTopicRegisterFormData(){
    const topicTitle = document.querySelector('#topic-title').value;
    const topicSubject = document.querySelector('#topic-subject').value;
    const topicDesc = document.querySelector('#topic-desc').value;
    const topicThumb = document.querySelector('#topic-thumbnail').files[0];
    const visibility = document.querySelector('input[name="visibility"]:checked')?.value;

    if(!topicTitle || topicTitle === ''){
        showToastMessage('대결 제목을 입력해주세요', 'alert');
        return {validationResult : false, formData : {}}
    }

    if(!topicSubject || topicSubject === ''){
        showToastMessage('주요개념을 입력해주세요', 'alert');
        return {validationResult : false, formData : {}}
    }

    if(!topicDesc || topicDesc === ''){
        showToastMessage('대결 설명을 입력해주세요', 'alert');
        return {validationResult : false, formData : {}}
    }

    if(!topicThumb){
        showToastMessage('대표이미지를 등록해주세요', 'alert');
        return {validationResult : false, formData : {}}
    }

    return {
        validationResult : true,
        formData:  {
            topicTitle : topicTitle,
            topicSubject : topicSubject,
            topicDesc : topicDesc,
            topicThumb : topicThumb,
            visibility :visibility

        }
    };
}

export function buildValidatedTopicUpdateFormData(){
    const topicTitle = document.querySelector('#topic-title').value;
    const topicSubject = document.querySelector('#topic-subject').value;
    const topicDesc = document.querySelector('#topic-desc').value;
    const topicThumb = document.querySelector('#topic-thumbnail').files[0];
    const visibility = document.querySelector('input[name="visibility"]:checked')?.value;

    if(!topicTitle || topicTitle === ''){
        showToastMessage('대결 제목을 입력해주세요', 'alert');
        return {validationResult : false, formData : {}}
    }

    if(!topicSubject || topicSubject === ''){
        showToastMessage('주요개념을 입력해주세요', 'alert');
        return {validationResult : false, formData : {}}
    }

    if(!topicDesc || topicDesc === ''){
        showToastMessage('대결 설명을 입력해주세요', 'alert');
        return {validationResult : false, formData : {}}
    }

    const currentData = {
        title : topicTitle,
        subject : topicSubject,
        description : topicDesc
    }

    if( !isModifiedTopic(currentData) ){ return { validationResult : true, formData : null} }

    return {
        validationResult : true,
        formData:  {
            topicTitle : topicTitle,
            topicSubject : topicSubject,
            topicDesc : topicDesc,
            ...(topicThumb && { topicThumb }),
            visibility :visibility

        }
    };
}