import {extractYoutubeVideoIdFromUrl} from "../../../global/js/youtube-iframe-api.js";
import {showToastMessage} from "../../../global/popup/js/common-toast-message.js";

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
            renderVideoPreviewWithEvents(mediaUrl);
            break;
        case 'YOUTUBE':
            renderYoutubePreviewWithErrorHandle(mediaUrl);
            break;
    }
}

// 이미지 타입 프리뷰 랜더링
function renderImagePreview(imageUrl){
    const viewerBody = document.querySelector('#viewer-body');
    const image = document.createElement('img');
    image.setAttribute('src' , `${imageUrl}`);
    image.setAttribute('alt' , 'entry-thumb-image');
    viewerBody.appendChild(image);

    toggleViewerLoadingStatus(false);
}

// 비디오 타입 프리뷰 랜더링
function renderVideoPreviewWithEvents(videoUrl){
    const viewerBody = document.querySelector('#viewer-body');

    const video = document.createElement('video');
    video.classList.add('video-preview');
    video.setAttribute('playsinline', '');
    video.setAttribute('controls', '');

    const videoSource = document.createElement('source');
    videoSource.src = `${videoUrl}`;
    videoSource.type = 'video/mp4';

    video.appendChild(videoSource);
    viewerBody.appendChild(video);


    video.addEventListener('canplaythrough', () => {
        setTimeout(() =>{
            toggleViewerLoadingStatus(false);
        }, 500)
    });

    video.addEventListener('error', (e) => {
        console.error('video view error :' ,e );
        showToastMessage('비디오를 불러오지 못했습니다.', 'error', 2500);
    });

}

// 유튜브 타입 프리뷰 랜더링
function renderYoutubePreviewWithErrorHandle(youtubeUrl){
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
        events : {
            'onError' : handleYoutubeError,
            'onReady' : handleYoutubeVideoReady
        }
    });
}

function handleYoutubeVideoReady(){
    toggleViewerLoadingStatus(false);
}

function handleYoutubeError(event){
    const errorCode = event.data;
    let message = '알 수 없는 오류가 발생했습니다.';
    switch (errorCode) {
        case 2:
            message = '잘못된 영상 주소입니다.';
            break;
        case 5:
            message = '이 브라우저에서 영상을 재생할 수 없습니다.';
            break;
        case 100:
            message = '삭제되었거나 비공개로 설정된 영상입니다.';
            break;
        case 101:
        case 150:
            message = '이 영상은 임베드 재생이 제한되어 있습니다.';
            break;
    }

    showToastMessage(message,'error' , 2500);
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