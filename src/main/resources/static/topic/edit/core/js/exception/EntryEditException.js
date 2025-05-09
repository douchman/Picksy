export class EntryCreateException extends Error {
    constructor(message = 'Topic Create Exception', status = 500) {
        super(message);
        this.status = status;
        this.name = 'EntryCreateException';
    }
}

export class EntryUpdateException extends Error {
    constructor(message = 'Topic Update Exception', status = 500) {
        super(message);
        this.status = status;
        this.name = 'EntryUpdateException';
    }
}