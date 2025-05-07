export class UserAuthException extends Error {
    constructor(message = 'User Auth Exception', status = 401) {
        super();
        this.status = status;
        this.name = 'UserAuthException';
    }
}

export class FetchNetworkException extends Error {
    constructor(message = 'API Network Exception', status = 500) {
        super(message);
        this.status = status;
        this.name = 'FetchNetworkException';
    }
}