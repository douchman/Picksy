import {buildValidatedTopicRegisterFormData, buildValidatedTopicUpdateFormData} from "./topic-form-data-builder.js";
import {createTopic, getTopicDetail, updateTopic} from "../api/topic-edit-api.js";
import {createdTopic} from "../const/const.js";
import {TopicCreateException, TopicUpdateException} from "../exception/TopicEditException.js";
import {TopicEditExceptionHandler} from "../exception/topic-edit-exception-handler.js";

const topicEditExceptionHandler = new TopicEditExceptionHandler();

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
    const {validationResult , formData } = buildValidatedTopicUpdateFormData();

    if( !validationResult) return false;
    if( !formData ) return true;

    const requestBody = new FormData();
    requestBody.append('title', formData.topicTitle);
    requestBody.append('subject', formData.topicSubject);
    requestBody.append('description', formData.topicDesc);
    formData.topicThumb && requestBody.append('thumbnail', formData.topicThumb);
    requestBody.append('visibility', formData.visibility);

    const topicUpdateResult = await updateTopic(createTopic.getId(), requestBody);

    if(!topicUpdateResult) {
        topicEditExceptionHandler.handle(new TopicUpdateException(validationResult.message, validationResult.status));
    }

    return true;
}

export async function getExistTopicDetail(){
    const topicDetailResult = await getTopicDetail(createdTopic.getId());
    if( topicDetailResult ){
        return topicDetailResult;
    } else {
        topicEditExceptionHandler.handle(new TopicUpdateException(topicDetailResult.messsage, topicDetailResult.status));
        return null;
    }
}