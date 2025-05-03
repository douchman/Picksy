import {blobToFile} from "../../../../global/js/file.js";

const thumbName = {
    'hqdefault' : 'hqdefault.jpg',
    'mqdefault' : 'mqdefault.jpg',
    'default' : 'default.jpg',
}

// 링크로부터 유튜브 정보 조회
export async function getYouTubeInfoFromUrl(url){
    const videoId = extractVideoId(url);

    if( !videoId ){
        return { result : false, message : '올바른 유튜브 링크를 입력해주세요', thumbNail : ''};
    }

    const thumbNailUrl = `https://img.youtube.com/vi/${videoId}/${thumbName['mqdefault']}`;
    const isValidThumbnailUrl = await validateThumbnail(thumbNailUrl);

    if( !isValidThumbnailUrl ){
        return { result : false, message : '유효하지 않은 썸네일 링크입니다.', thumbNail : ''};
    }
    return { result : true, message : '', thumbNail : thumbNailUrl};
}

// 비디오 아이디 추출
function extractVideoId(url){
    try {
        const regExp =
            /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = url.match(regExp);
        return match ? match[1] : null;
    } catch (e) {
        return null;
    }
}

// 추출 된 썸네일 주소 검증
async function validateThumbnail(url) {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok; // true if status 200-299
    } catch (e) {
        return false;
    }
}

// 썸네일 링크로부터 blob -> file 변환
export async function getThumbNailFileFromYoutubeUrl(imageUrl) {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return blobToFile(blob);
}

