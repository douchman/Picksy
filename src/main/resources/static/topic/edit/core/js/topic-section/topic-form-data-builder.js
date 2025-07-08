import {showToastMessage} from "../../../../../global/toast-message/js/common-toast-message.js";
import {isModifiedTopic} from "../const/initial-topic.js";
import {uploadTopicThumbnail} from "./topic-thumb-uploader.js";
import {Visibility} from "../../../../../global/const/const.js";

export async function buildValidatedTopicRegisterPayload(){

    const { title, subject, description, thumbnail, visibility, accessCode}  = getTopicInputValues();

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
        return {validationResult : false, topicRegisterPayload : null}
    }

    if(!thumbnail){
        showToastMessage('대표이미지를 등록해주세요', 'alert');
        return {validationResult : false, topicRegisterPayload : null}
    }

    if(Visibility.PASSWORD === visibility && !validateAccessCode(accessCode)){
        showToastMessage('대결 주제 비밀번호를 확인해주세요(한글, 영어, 숫자 1~255 자)', 'alert');
        return {validationResult : false, topicRegisterPayload : null}
    }

    const { result : isUploadSuccess, thumbnailUrl} = await uploadTopicThumbnail(thumbnail);
    if( !isUploadSuccess ){
        return { validationResult : false, topicRegisterPayload:  null };
    }

    const topicRegisterPayload = {
        title : title,
        subject : subject,
        description : description,
        visibility : visibility,
        thumbnail : thumbnailUrl,
        accessCode : accessCode
    };

    return { validationResult : true, topicRegisterPayload };

}

export async function buildValidatedTopicUpdatePayload(){

    const { title, subject, description, thumbnail, visibility, accessCode}  = getTopicInputValues();

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

    if(Visibility.PASSWORD === visibility && !validateAccessCode(accessCode)){
        showToastMessage('대결 주제 비밀번호를 확인해주세요(한글, 영어, 숫자 1~255 자)', 'alert');
        return {validationResult : false, topicRegisterPayload : null}
    }

    const currentData = {
        title,
        subject,
        description,
    }

    if( !isModifiedTopic(currentData) ){ return { validationResult : true, topicUpdatePayload : null} }

    const topicUpdatePayload = {
        title : title,
        subject : subject,
        description : description,
        visibility : visibility,
        accessCode : accessCode
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
    const accessCode = document.querySelector('#access-code').value;

    return {
        title,
        subject,
        description,
        thumbnail,
        visibility,
        accessCode
    };
}

function validateAccessCode(topicPassword){
    const regex = /^[ㄱ-ㅎ가-힣ㅏ-ㅣa-zA-Z0-9]{1,255}$/;
    return regex.test(topicPassword);
}