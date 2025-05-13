import {buildValidatedTopicRegisterFormData, buildValidatedTopicUpdateFormData} from "./topic-form-data-builder.js";
import {createTopic, getTopicDetail, updateTopic} from "../api/topic-edit-api.js";
import {createdTopic} from "../const/const.js";
import {TopicCreateException, TopicUpdateException} from "../exception/TopicEditException.js";
import {TopicEditExceptionHandler} from "../exception/topic-edit-exception-handler.js";
import {setInitialTopic} from "../const/initial-topic.js";

const topicEditExceptionHandler = new TopicEditExceptionHandler();

export async function registerTopic(){
    const {validationResult , formData : topicRegisterFromData} = buildValidatedTopicRegisterFormData();

    if( !validationResult || !topicRegisterFromData ) return false;

    const topicCreateResult = await createTopic(topicRegisterFromData);

    if( !topicCreateResult){
        topicEditExceptionHandler.handle(new TopicCreateException(validationResult.message, validationResult.status));
    }

    setCreatedTopicId(topicCreateResult);
    saveRegisteredTopicData(topicCreateResult);

    return true;
}

export async function modifyTopic(){
    const {validationResult , formData : topicModifyFormData } = buildValidatedTopicUpdateFormData();

    if( !validationResult) return false;
    if( !topicModifyFormData ) return true;

    const topicUpdateResult = await updateTopic(createTopic.getId(), topicModifyFormData);

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

function setCreatedTopicId(topicCreateResult){
    createdTopic.setId(topicCreateResult.topicId);
}

function saveRegisteredTopicData(topicCreateResult){
    const registeredTopicData = {
        title : topicCreateResult.title,
        subject : topicCreateResult.subject,
        description : topicCreateResult.description
    }
    setInitialTopic(registeredTopicData);
}