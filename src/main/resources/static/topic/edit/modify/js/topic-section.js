import {createdTopic} from "../../core/js/const/const.js";
import {createTopic, getTopicDetail, updateTopic} from "../../core/js/api/topic-edit-api.js";
import {TopicEditExceptionHandler} from "../../core/js/exception/topic-edit-exception-handler.js";
import {TopicCreateException, TopicUpdateException} from "../../core/js/exception/TopicEditException.js";
import {addTopicSectionEvents} from "../../core/js/topic-section/section-events.js";
import {buildValidatedTopicRegisterFormData} from "../../core/js/topic-section/topic-form-data-builder.js";

const topicEditExceptionHandler = new TopicEditExceptionHandler()

export async function setupTopicSection(){
    if(await renderTopicDetail(createdTopic.getId())){
        addTopicSectionEvents();
    }
}

export async function registerTopic(){
    const {validationResult , formData : {topicTitle, topicSubject, topicDesc, topicThumb, visibility }} = buildValidatedTopicRegisterFormData();

    if( validationResult ){
        const requestBody = new FormData();
        requestBody.append('title', topicTitle);
        requestBody.append('subject', topicSubject);
        requestBody.append('description', topicDesc);
        requestBody.append('thumbnail', topicThumb);
        requestBody.append('visibility', visibility);

        const topicCreateResult = await createTopic(requestBody);

        if( topicCreateResult){
            createdTopic.setId(topicCreateResult.topicId);
            return true;
        } else {
            topicEditExceptionHandler.handle(new TopicCreateException(validationResult.message, validationResult.status));
            return false;
        }
    }
    return false;
}

export async function modifyTopic(){
    const {validationResult , formData : {topicTitle, topicSubject, topicDesc, topicThumb, visibility }} = validateAndGenerateTopicFormData();

    if( validationResult ){
        const requestBody = new FormData();
        requestBody.append('title', topicTitle);
        requestBody.append('subject', topicSubject);
        requestBody.append('description', topicDesc);
        requestBody.append('thumbnail', topicThumb);
        requestBody.append('visibility', visibility);

        const topicUpdateResult = await updateTopic(createTopic.getId(), requestBody);

        if(topicUpdateResult){
            return true;
        } else {
            topicEditExceptionHandler.handle(new TopicUpdateException(validationResult.message, validationResult.status));
            return false;
        }
    }
    return false;
}

async function renderTopicDetail(topicId){
    const topicDetailResult = await getTopicDetail(topicId);

    console.log('topicDetail', topicDetailResult);

    if( topicDetailResult ){
        const topicDetail = topicDetailResult.topic;

        // 대결주제 이미지 랜더링
        const topicThumbnailPreview = document.querySelector('#topic-thumbnail-preview');
        topicThumbnailPreview.style.backgroundImage = `url(${topicDetail.thumbnail})`;
        topicThumbnailPreview.classList.add('uploaded');

        // 대결주제 제목, 서브주제, 설명 랜더링
        document.querySelector('#topic-title').value = topicDetail.title;
        document.querySelector('#topic-subject').value = topicDetail.subject;
        document.querySelector('#topic-desc').value = topicDetail.description;

        // 공개 범위 랜더링
        // TODO : API 수정 이후 처리 필요

    } else {
        topicEditExceptionHandler.handle(new TopicUpdateException(topicDetailResult.messsage, topicDetailResult.status));
        return false;
    }

    return true;
}