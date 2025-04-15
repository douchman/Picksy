export function renderEntryThumbViewer(){
    const thumbViewer =
        `<div id="entry-thumb-viewer" class="entry-thumb-viewer">
            <div class="bg"></div>
            <div class="viewer-body">
                <button id="btn-close-thumb-viewer" class="btn-close-thumb-viewer" type="button"></button>
            </div>
        </div>`;

    document.querySelector('#topic-statistics').insertAdjacentHTML('beforeend', thumbViewer);

    addEntryThumbViewerEvent();
}

function addEntryThumbViewerEvent(){
    
    // 닫기 버튼 이벤트
    document.querySelector('#btn-close-thumb-viewer').addEventListener('click', () => {
        hideThumbViewer();
    });

    // 배경 클릭 이벤트
    document.querySelector('#entry-thumb-viewer .bg').addEventListener('click', () => {
        hideThumbViewer();
    });
}

export function showThumbViewer(){
    toggleBodyScrollBlocked(true);
    document.querySelector('#entry-thumb-viewer').classList.add('show');
}

export function hideThumbViewer(){
    toggleBodyScrollBlocked(false);
    document.querySelector('#entry-thumb-viewer').classList.remove('show');
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