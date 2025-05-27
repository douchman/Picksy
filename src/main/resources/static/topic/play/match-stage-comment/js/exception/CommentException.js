export class GetCommentsException extends Error {
    constructor(message = '유저 코멘트 조회에 문제가 생겼어요.', status = 500) {
        super(message);
        this.status = status;
        this.name = 'GetCommentsException';
    }
}

export class RegisterCommentException extends Error {
    constructor(message = '코멘트 작성에 문제가 생겼어요.', status = 500) {
        super(message);
        this.status = status;
        this.name = 'RegisterCommentException';
    }
}