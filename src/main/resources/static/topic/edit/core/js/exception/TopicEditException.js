export class TopicCreateException extends Error{
    constructor(message = 'Topic Create Exception', status = 500) {
        super(message);
        this.status = status;
        this.name = 'TopicCreateException';
    }
}

export class TopicUpdateException extends Error{
    constructor(message = 'Topic Update Exception', status = 500) {
        super(message);
        this.status = status;
        this.name = 'TopicUpdateException';
    }
}