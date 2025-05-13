import {createdTopic} from "../../core/js/const/const.js";
import {createTopic, updateTopic} from "../../core/js/api/topic-edit-api.js";
import {TopicEditExceptionHandler} from "../../core/js/exception/topic-edit-exception-handler.js";
import {TopicCreateException, TopicUpdateException} from "../../core/js/exception/TopicEditException.js";
import {addTopicSectionEvents} from "../../core/js/topic-section/section-events.js";
import {buildValidatedTopicRegisterFormData} from "../../core/js/topic-section/topic-form-data-builder.js";

const topicEditExceptionHandler = new TopicEditExceptionHandler()

export function setupTopicSection(){
    addTopicSectionEvents();
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
