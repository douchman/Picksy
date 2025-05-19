export class GetMyTopicException extends Error {
    constructor(message = '내가 만든 대결주제 조회 중 문제가 생겼어요.', status = 500) {
        super(message);
        this.status = status;
        this.name = 'GetMyTopicException';
    }
}