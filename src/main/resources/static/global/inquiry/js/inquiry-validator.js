import {showToastMessage} from "../../toast-message/js/common-toast-message.js";

const authorRegex = /^[a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ\s.,!?(){}\[\]'"\-@_/:;]{1,50}$/;
const titleRegex = /^[a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ\s.,!?(){}\[\]'"\-@_/:;]{1,250}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateAuthor(author) {
    const isValid = authorRegex.test(author)

    if(!isValid){
        showToastMessage({
            toastType : 'alert',
            title : '잘못된 작성자 명',
            content : '작성자명을 확인해주세요. 특수문자는 허용되지 않습니다.'
        });
    }

    return isValid;
}


export function validateEmail(email) {
    const isValid = emailRegex.test(email) && email.length < 250

    if(!isValid){
        showToastMessage({
            toastType : 'alert',
            title : '잘못된 이메일 주소',
            content : '이메일을 확인해주세요.'
        });
    }

    return isValid;
}


export function validateTitle(title) {
    const isValid = titleRegex.test(title)

    if(!isValid){
        showToastMessage({
            toastType : 'alert',
            title : '잘못된 제목',
            content : '제목을 확인해주세요. 특수문자는 허용되지 않습니다.'
        });
    }

    return isValid;
}