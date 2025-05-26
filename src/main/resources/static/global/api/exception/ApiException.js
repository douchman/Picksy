export class FetchNetworkException extends Error {
    constructor(message = 'API Network Exception', status = 500) {
        super(message);
        this.status = status;
        this.name = 'FetchNetworkException';
    }
}