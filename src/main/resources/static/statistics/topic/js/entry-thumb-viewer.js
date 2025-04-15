import {extractYoutubeVideoIdFromUrl} from "../../../global/js/youtube-iframe-api.js";

export function renderEntryMediaViewer(){
    const thumbViewer =
        `<div id="entry-media-viewer" class="entry-media-viewer loading">
            <div class="bg"></div>
            <div id="viewer-body" class="viewer-body">
                <button id="btn-close-media-viewer" class="btn-close-media-viewer" type="button"></button>
            </div>
        </div>`;

    document.querySelector('#topic-statistics').insertAdjacentHTML('beforeend', thumbViewer);

    addEntryMediaViewerEvent();
}

function addEntryMediaViewerEvent(){
    
    // 닫기 버튼 이벤트
    document.querySelector('#btn-close-media-viewer').addEventListener('click', () => {
        hideThumbViewer();
    });

    // 배경 클릭 이벤트
    document.querySelector('#entry-media-viewer .bg').addEventListener('click', () => {
        hideThumbViewer();
    });
}

export function showThumbViewer(mediaType, mediaUrl){
    toggleBodyScrollBlocked(true);
    renderPreviewByMediaType(mediaType, mediaUrl); // 타입 분기 프리뷰 랜더링
    document.querySelector('#entry-media-viewer').classList.add('show');
}

function hideThumbViewer(){
    clearPreviewBody(); // 뷰 바디 비움
    toggleBodyScrollBlocked(false);
    document.querySelector('#entry-media-viewer').classList.remove('show');
}

// 미디어 타입에 맞는 프리뷰 랜더링
function renderPreviewByMediaType(mediaType, mediaUrl){
    switch (mediaType){
        case 'IMAGE':
            renderImagePreview(mediaUrl);
            break;
        case 'VIDEO':
            renderVideoPreview(mediaUrl);
            break;
        case 'YOUTUBE':
            renderYoutubePreview(mediaUrl);
            break;
    }
}

// 이미지 타입 프리뷰 랜더링
function renderImagePreview(imageUrl){
    const viewerBody = document.querySelector('#viewer-body');
    const image =
        `<img src="${imageUrl}" alt="entry-thumb-image" />`
    viewerBody.insertAdjacentHTML('beforeend', image);
}

// 비디오 타입 프리뷰 랜더링
function renderVideoPreview(videoUrl){
    const viewerBody = document.querySelector('#viewer-body');
    const video =
        `<video class="video-preview" playsinline controls>
                <source src="${videoUrl}" type="video/mp4">
            </video>`;
    viewerBody.insertAdjacentHTML('beforeend', video);
}

// 유튜브 타입 프리뷰 랜더링
function renderYoutubePreview(youtubeUrl){
    const viewerBody = document.querySelector('#viewer-body');

    const youtubeVideo = document.createElement('div');
    youtubeVideo.classList.add('you-tube-video');
    viewerBody.appendChild(youtubeVideo);

    const videoId = extractYoutubeVideoIdFromUrl(youtubeUrl);

    if(viewerBody._ytPlayer){
        viewerBody._ytPlayer.destroy();
    }

    viewerBody._ytPlayer = new YT.Player(youtubeVideo, {
        width: '640',
        height: '360',
        videoId: videoId,
        playerVars: {
            rel : 0,
            'playsinline': 1
        },
    });
}

// 미디어 뷰어 로딩 상태 제어
function toggleViewerLoadingStatus(isLoading){
    const entryMediaViewer = document.querySelector('#entry-media-viewer');

    isLoading ?
        entryMediaViewer.classList.add('loading')
        : entryMediaViewer.classList.remove('loading');

}

// viewBody 에 랜더링 된 기존 프리뷰 제거
function clearPreviewBody(){
    toggleViewerLoadingStatus(true); // 로딩 상태로 복귀
    const viewerBody = document.querySelector('#viewer-body');

    // 제거 대상: 프리뷰 요소들만 정밀 제거
    viewerBody.querySelectorAll('img, video, .you-tube-video').forEach(el => el.remove());
}


/**
 * 메인 레이아웃 스크롤 제어
 * @param {boolean} isBlock
 */
function toggleBodyScrollBlocked(isBlock = false){
    const body = document.querySelector('body');

    isBlock ?
        body.classList.add('scroll-block')
        : body.classList.remove('scroll-block');
}