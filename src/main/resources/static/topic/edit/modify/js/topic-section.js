import {createdTopic} from "../../core/js/const/const.js";
import {getTopicDetail} from "../../core/js/api/topic-edit-api.js";
import {TopicEditExceptionHandler} from "../../core/js/exception/topic-edit-exception-handler.js";
import {TopicUpdateException} from "../../core/js/exception/TopicEditException.js";
import {addTopicSectionEvents} from "../../core/js/topic-section/section-events.js";

const topicEditExceptionHandler = new TopicEditExceptionHandler()

export async function setupTopicSection() {
    if (await renderTopicDetail(createdTopic.getId())) {
        addTopicSectionEvents();
    }
}

async function renderTopicDetail(topicId){
    const topicDetailResult = await getTopicDetail(topicId);

    console.log('topicDetail', topicDetailResult);

    if( topicDetailResult ){
        const topicDetail = topicDetailResult.topic;

        // 대결주제 이미지 랜더링
        const topicThumbnailPreview = document.querySelector('#topic-thumbnail-preview');
        topicThumbnailPreview.style.backgroundImage = `url(${topicDetail.thumbnail})`;
        topicThumbnailPreview.classList.add('uploaded');

        // 대결주제 제목, 서브주제, 설명 랜더링
        document.querySelector('#topic-title').value = topicDetail.title;
        document.querySelector('#topic-subject').value = topicDetail.subject;
        document.querySelector('#topic-desc').value = topicDetail.description;

        // 공개 범위 랜더링
        // TODO : API 수정 이후 처리 필요

    } else {
        topicEditExceptionHandler.handle(new TopicUpdateException(topicDetailResult.messsage, topicDetailResult.status));
        return false;
    }

    return true;
}