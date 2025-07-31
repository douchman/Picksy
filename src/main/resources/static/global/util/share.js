import {showToastMessage} from "../toast-message/js/common-toast-message.js";

const COPY_SUCCESS_MESSAGE = "공유 링크를 복사했어요 :)";
const COPY_FAIL_MESSAGE = "링크를 복사하기 못했어요 :(";

export function shareTopic(topicId){
    if( topicId ){
        copyURLToClipboard(generateTopicPlayUrl(topicId));
    }
}

function generateTopicPlayUrl(topicId){
    const origin = window.location.origin;
    return `${origin}/topic/play/${topicId}`
}

function copyURLToClipboard(url) {
    if (!navigator.clipboard) {
        // fallback (구형 브라우저)
        const textarea = document.createElement("textarea");
        textarea.value = url;
        textarea.style.position = "fixed";  // iOS에서 화면 스크롤 방지용
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        try {
            document.execCommand("copy");
            showToastMessage({
                title : '대결 공유',
                content : COPY_SUCCESS_MESSAGE
            });
        } catch (err) {
            showToastMessage({
                title : '대결 공유 실패',
                content : COPY_FAIL_MESSAGE
            });
        }
        document.body.removeChild(textarea);
        return;
    }

    // 최신 브라우저
    navigator.clipboard.writeText(url)
        .then(() => showToastMessage({
            title : '대결 공유',
            content : COPY_SUCCESS_MESSAGE
        }))
        .catch(() => showToastMessage({
            title : '대결 공유 실패',
            content : COPY_FAIL_MESSAGE
        }));
}