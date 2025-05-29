export class TopicIdSaveException extends Error{
    constructor(message = '대결주제 정보를 확인할 수 없어요.', status = 404) {
        super(message);
        this.status = status;
        this.name = 'TopicIdSaveException';
    }
}