import {addTopicSectionEvents} from "../../core/js/topic-section/section-events.js";
import {getExistTopicDetail} from "../../core/js/topic-section/topic-actions.js";
import {renderTopicDetail} from "../../core/js/topic-section/topic-renderer";

export async function setupTopicSection() {
    const topicDetailResult = await getExistTopicDetail();
    if( topicDetailResult ) {
        renderTopicDetail(topicDetailResult)
        addTopicSectionEvents();
    }
}
