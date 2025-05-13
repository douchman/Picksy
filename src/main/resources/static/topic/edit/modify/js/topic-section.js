import {addTopicSectionEvents} from "../../core/js/topic-section/section-events.js";
import {getExistTopicDetail} from "../../core/js/topic-section/topic-actions.js";

export async function setupTopicSection() {
    const topicDetail = await getExistTopicDetail();
    if( topicDetail ) {
        addTopicSectionEvents();
    }
}
