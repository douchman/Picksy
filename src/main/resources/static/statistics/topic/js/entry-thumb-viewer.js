export function renderEntryMediaViewer(){
    const thumbViewer =
        `<div id="entry-media-viewer" class="entry-media-viewer">
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

export function showThumbViewer(){
    toggleBodyScrollBlocked(true);
    document.querySelector('#entry-media-viewer').classList.add('show');
}

export function hideThumbViewer(){
    toggleBodyScrollBlocked(false);
    document.querySelector('#entry-media-viewer').classList.remove('show');
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