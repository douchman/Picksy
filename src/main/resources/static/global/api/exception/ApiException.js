export class FetchNetworkException extends Error {
    constructor(status = 500, errorCode, message = '서버와 연결 중 문제가 발생했습니다. 잠시 수 다시 시도해주세요.', ) {
        super(message);
        this.status = status;
        this.name = 'FetchNetworkException';
        this.errorCode = errorCode;
    }
}

export class ApiResponseException extends Error {
    constructor(status = 500, errorCode, message = '요청한 내용 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요', ) {
        super(message);
        this.status = status;
        this.name = 'ApiResponseException';
        this.errorCode = errorCode;
    }
}