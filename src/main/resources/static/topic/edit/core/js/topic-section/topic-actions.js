import {buildValidatedTopicRegisterPayload, buildValidatedTopicUpdatePayload} from "./topic-form-data-builder.js";
import {createTopic, getTopicDetail, updateTopic} from "../api/topic-edit-api.js";
import {createdTopic} from "../const/const.js";
import {TopicEditExceptionHandler} from "../exception/topic-edit-exception-handler.js";
import {setInitialTopic} from "../const/initial-topic.js";

const topicEditExceptionHandler = new TopicEditExceptionHandler();

export async function registerTopic(){
    const {validationResult , topicRegisterPayload} = await buildValidatedTopicRegisterPayload();

    if( !validationResult || !topicRegisterPayload ) return false;

    try {
        const topicCreateResult = await createTopic(topicRegisterPayload);

        setCreatedTopicId(topicCreateResult);
        saveRegisteredTopicData(topicCreateResult);
    } catch (error){
        topicEditExceptionHandler.handle(error, {context : 'topicCreate'});
        return false;
    }

    return true;
}

export async function modifyTopic(){
    const {validationResult , topicUpdatePayload } = await buildValidatedTopicUpdatePayload();

    if( !validationResult) return false;
    if( !topicUpdatePayload ) return true;

    try {
        await updateTopic(createdTopic.getId(), topicUpdatePayload);
    } catch (error){
        topicEditExceptionHandler.handle(error, {context : 'topicModify'});
        return false;
    }
    return true;
}

export async function getExistTopicDetail(){
    try {
        return await getTopicDetail(createdTopic.getId());
    } catch (error) {
        topicEditExceptionHandler.handle(error, {context : 'topicDetail'});
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
        description : topicCreateResult.description,
        visibility : topicCreateResult.visibility
    }
    setInitialTopic(registeredTopicData);
}