import {showToastMessage} from "../../toast-message/js/common-toast-message.js";

const authorRegex = /^[a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ\s.,!?(){}\[\]'"\-@_/:;]{1,50}$/;
const titleRegex = /^[a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ\s.,!?(){}\[\]'"\-@_/:;]{1,250}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateAuthor(author) {
    const isValid = authorRegex.test(author)

    if(!isValid){
        showToastMessage('작성자명을 확인해주세요. 특수문자는 허용되지 않습니다.', 'alert', 2000);
    }

    return isValid;
}


export function validateEmail(email) {
    const isValid = emailRegex.test(email) && email.length < 250

    if(!isValid){
        showToastMessage('이메일을 확인해주세요', 'alert', 2000);
    }

    return isValid;
}


export function validateTitle(title) {
    const isValid = titleRegex.test(title)

    if(!isValid){
        showToastMessage('제목을 확인해주세요. 특수문자는 허용되지 않습니다.', 'alert', 2000);
    }

    return isValid;
}