const authorRegex = /^[가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9]{2,255}$/;
const commentContentRegex = /^[가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9\s.,!?()@#%&*~_\-+=:;]{2,500}$/;

export const authorValidationMessage = '작성자 이름은 한글, 영어, 숫자 조합 2자 이상 255자 이하로 입력해주세요.';
export const commentContentValidationMessage = '댓글은 한글, 영어, 숫자와 일반적인 특수문자만 사용하여 2자 이상 500자 이하로 입력해주세요.';

export function validateAuthor(author){
    return authorRegex.test(author);
}

export function validateCommentContent(commentContent){
    return commentContentRegex.test(commentContent);
}