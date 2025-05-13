export const initialTopic = {}

export function setInitialTopic(topic){
    if(topic){
        initialTopic.title = topic.title;
        initialTopic.subject = topic.subject;
        initialTopic.description = topic.description;
        // TODO : visibility 관련 API 수정 이후 추가 필요
    }
}

export function isModifiedTopic(currentData){
    return (
        initialTopic.title !== currentData.title ||
        initialTopic.subject !== currentData.subject ||
        initialTopic.description !== currentData.description
    );
}