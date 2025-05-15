import {addTopicSectionEvents} from "../../core/js/topic-section/section-events.js";
import {getExistTopicDetail} from "../../core/js/topic-section/topic-actions.js";
import {renderTopicDetail} from "../../core/js/topic-section/topic-renderer.js";
import {setInitialTopic} from "../../core/js/const/initial-topic.js";

export async function setupTopicSection() {
    const topicDetailResult = await getExistTopicDetail();
    if( topicDetailResult ) {
        cacheInitialTopicData(topicDetailResult.topic);
        renderTopicDetail(topicDetailResult);
        addTopicSectionEvents();
    }
}

function cacheInitialTopicData(topic){
    setInitialTopic(topic);
}