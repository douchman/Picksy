import {createdTopic} from "../../core/js/const/const.js";
import {addTopicSectionEvents} from "../../core/js/topic-section/section-events.js";
import {renderTopicDetail} from "../../core/js/topic-section/topic-renderer.js";

export async function setupTopicSection() {
    if (await renderTopicDetail(createdTopic.getId())) {
        addTopicSectionEvents();
    }
}
