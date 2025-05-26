export class FetchNetworkException extends Error {
    constructor(status = 500, errorCode, message = '네트워크 연결 오류', ) {
        super(message);
        this.status = status;
        this.name = 'FetchNetworkException';
        this.errorCode = errorCode;
    }
}

export class ApiResponseException extends Error {
    constructor(status = 500, errorCode, message = 'API 응답 예외', ) {
        super(message);
        this.status = status;
        this.name = 'ApiResponseException';
        this.errorCode = errorCode;
    }
}