import {Visibility} from "../../../../../global/const/const.js";

export function renderTopicDetail(topicDetailResult){
    const topicDetail = topicDetailResult.topic;

    // 대결주제 이미지 랜더링
    const topicThumbnailPreview = document.querySelector('#topic-thumbnail-preview');
    topicThumbnailPreview.style.backgroundImage = `url(${topicDetail.thumbnail})`;
    topicThumbnailPreview.classList.add('uploaded');

    // 대결주제 제목, 서브주제, 설명 랜더링
    document.querySelector('#topic-title').value = topicDetail.title;
    document.querySelector('#topic-subject').value = topicDetail.subject;
    document.querySelector('#topic-desc').value = topicDetail.description;

    renderTopicVisibility(topicDetail.visibility, topicDetail.accessCode);
}

// 대결주제 공개범위 랜더링
function renderTopicVisibility(visibility, accessCode){
    const visibilityRadio = document.querySelector(`input[name="visibility"][value="${visibility}"]`);

    if( visibilityRadio ) {
        visibilityRadio.checked = true;
    }

    if( Visibility.PASSWORD === visibility){
        document.querySelector('#access-code-group').classList.add('show');
        document.querySelector('#access-code').value = accessCode;
    }
}