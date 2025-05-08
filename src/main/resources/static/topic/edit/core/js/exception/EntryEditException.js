export class EntryCreateException extends Error {
    constructor(message = 'Topic Create Exception', status = 500) {
        super(message);
        this.status = status;
        this.name = 'EntryCreateException';
    }
}