export class UserAuthException extends Error {
    constructor(message = '회원 인증 오류', status = 401) {
        super();
        this.status = status;
        this.name = 'UserAuthException';
    }
}
