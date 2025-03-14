const idRegex = /^[a-z0-9]{6,20}$/;
const nameRegex = /^[a-zA-Z0-9가-힣]{1,12}$/;
const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+~={}\[\]:;"'<>,.?/])[a-zA-Z\d!@#$%^&*()_+~={}\[\]:;"'<>,.?/]{8,20}$/;

export const idValidationMessage = '아이디는 영어(소문자), 숫자 조합 6 ~ 20자 까지 가능합니다.'
export const nameValidationMessage = '이름은 한글, 영어(대/소문자), 숫자 조합 최대 12자까지 가능합니다. '
export const passwordMismatchMessage = '비밀번호가 일치하지 않습니다.'
export const passwordValidationMessage = '비밀번호는 영어(대/소문자), 숫자 , 특수문자조합 8 ~ 20자까지 가능합니다.'


export function validateId(id){
    return idRegex.test(id);
}

export function validateName(name){
    return nameRegex.test(name);
}

export function isPasswordEqual(password, passwordConfirm){
    return password === passwordConfirm;
}

export function validatePassword(password){
    return passwordRegex.test(password);
}

