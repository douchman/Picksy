import {showToastMessage} from "../../../../../global/toast-message/js/common-toast-message.js";
import {isModifiedTopic} from "../const/initial-topic.js";
import {uploadTopicThumbnail} from "./topic-thumb-uploader.js";

export async function buildValidatedTopicRegisterPayload(){

    const { title, subject, description, thumbnail, visibility}  = getTopicInputValues();

    if(!title || title === ''){
        showToastMessage('대결 제목을 입력해주세요', 'alert');
        return {validationResult : false, topicRegisterPayload : null}
    }

    if(!subject || subject === ''){
        showToastMessage('주요개념을 입력해주세요', 'alert');
        return {validationResult : false, topicRegisterPayload : null}
    }

    if(!description || description === ''){
        showToastMessage('대결 설명을 입력해주세요', 'alert');
        return {validationResult : false, topicRegisterPayload : nulll}
    }

    if(!thumbnail){
        showToastMessage('대표이미지를 등록해주세요', 'alert');
        return {validationResult : false, topicRegisterPayload : null}
    }

    const { result : isUploadSuccess, thumbnailUrl} = await uploadTopicThumbnail(thumbnail);
    if( !isUploadSuccess ){
        return { validationResult : false, topicRegisterPayload:  null };
    }

    const topicRegisterPayload = {
        title : subject,
        subject : subject,
        description : description,
        visibility : visibility,
        thumbnail : thumbnailUrl
    };

    return { validationResult : true, topicRegisterPayload };

}

export async function buildValidatedTopicUpdatePayload(){

    const { title, subject, description, thumbnail, visibility}  = getTopicInputValues();

    if(!title || title === ''){
        showToastMessage('대결 제목을 입력해주세요', 'alert');
        return {validationResult : false, topicUpdatePayload : null}
    }

    if(!subject || subject === ''){
        showToastMessage('주요개념을 입력해주세요', 'alert');
        return {validationResult : false, topicUpdatePayload : null}
    }

    if(!description || description === ''){
        showToastMessage('대결 설명을 입력해주세요', 'alert');
        return {validationResult : false, topicUpdatePayload : null}
    }

    const currentData = {
        title,
        subject,
        description,
    }

    if( !isModifiedTopic(currentData) ){ return { validationResult : true, topicUpdatePayload : null} }

    const topicUpdatePayload = {
        title : subject,
        subject : subject,
        description : description,
        visibility : visibility
    };

    if(thumbnail){ // 새로 업로드 할 대표 이미지 존재 시
        const { result : isUploadSuccess, thumbnailUrl} = await uploadTopicThumbnail(thumbnail);
        if( !isUploadSuccess ){
            return { validationResult : false, formData:  {} };
        }
        topicUpdatePayload.thumbnail = thumbnailUrl;
    }

    return { validationResult : true, topicUpdatePayload };
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