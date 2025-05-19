export class TopicDetailException extends Error {
    constructor(message = '대결주제 조회 중 문제가 생겼어요.', status = 500) {
        super(message);
        this.status = status;
        this.name = 'TopicDetailException';
    }
}

export class PlayRecordIdException extends Error {
    constructor(message = '대결주제 시작을 위한 준비 중 문제가 생겼어요', status = 500) {
        super(message);
        this.status = status;
        this.name = 'PlayRecordIdException';
    }
}
