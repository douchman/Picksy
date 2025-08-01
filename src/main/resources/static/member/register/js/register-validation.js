const idRegex = /^[a-z0-9]{4,20}$/;
const nameRegex = /^[a-z0-9가-힣]{1,12}$/;
const passwordRegex = /^.{4,20}$/;

export const idValidationMessage = '아이디는 영어(소문자), 숫자를 자유롭게 조합해 4 ~ 20자까지 입력할 수 있어요.'
export const nameValidationMessage = '닉네임은 영어(소문자), 한글, 숫자를 자유롭게 조합해 12자까지 입력할 수 있어요.'
export const passwordMismatchMessage = '비밀번호가 일치하지 않습니다.'
export const passwordValidationMessage = '비밀번호는 영어, 숫자, 특수문자 중 자유롭게 입력할 수 있어요.(4~20자)'


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

