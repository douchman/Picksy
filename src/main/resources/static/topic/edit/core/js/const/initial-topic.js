import {Visibility} from "../../../../../global/const/const.js";

export const initialTopic = {}

export function setInitialTopic(topic){
    if(topic){
        initialTopic.title = topic.title;
        initialTopic.subject = topic.subject;
        initialTopic.description = topic.description;
        initialTopic.accessCode = topic.accessCode;
        initialTopic.isThumbnailChanged = false;
        initialTopic.visibility = Visibility.PRIVATE;
    }
}

export function isModifiedTopic(currentData){
    return (
        initialTopic.title !== currentData.title ||
        initialTopic.subject !== currentData.subject ||
        initialTopic.description !== currentData.description ||
        initialTopic.accessCode !== currentData.accessCode ||
        initialTopic.visibility !== currentData.visibility ||
        initialTopic.isThumbnailChanged
    );
}