import {Visibility} from "../../../../../global/js/const.js";

export const initialTopic = {}

export function setInitialTopic(topic){
    if(topic){
        initialTopic.title = topic.title;
        initialTopic.subject = topic.subject;
        initialTopic.description = topic.description;
        initialTopic.isThumbnailChanged = false;
        initialTopic.visibility = Visibility.PRIVATE;
    }
}

export function isModifiedTopic(currentData){
    return (
        initialTopic.title !== currentData.title ||
        initialTopic.subject !== currentData.subject ||
        initialTopic.description !== currentData.description ||
        initialTopic.visibility !== currentData.visibility ||
        initialTopic.isThumbnailChanged
    );
}