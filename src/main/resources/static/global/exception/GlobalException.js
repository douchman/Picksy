export class UserAuthException extends Error {
    constructor(message = '회원 인증 오류', status = 401, errorCode) {
        super(message);
        this.status = status;
        this.name = 'UserAuthException';
        this.errorCode = errorCode;
    }
}
