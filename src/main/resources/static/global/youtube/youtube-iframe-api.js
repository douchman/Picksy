export function loadYoutubeIframeAPI(){
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

export function onYouTubeIframeApiReady(callBack) {
    // 유튜브 API 로드 후 callBack
    window.onYouTubeIframeAPIReady = async () => {
        if( typeof callBack === 'function'){

            try {
                callBack();
            } catch (e) {
                console.error('onYouTubeIframeApiReady callback error ' , e);
            }

        }
    };
}

// 유튜브 URL 로 부터 비디오 ID 추출
export function extractYoutubeVideoIdFromUrl(url) {
    const regExp = /(?:youtube\.com\/.*[?&]v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
}
