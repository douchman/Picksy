// 대결 진행 정보 playRecordId 저장 Exception
export class SavePlayRecordInfoException extends Error {
    constructor(message = '대결 진행 정보를 확인할 수 없어요 :(', status = 500) {
        super(message);
        this.status = status;
        this.name = 'PlayRecordInfoSaveException';
    }
}

// 대결 주제 정보 저장 Exception
export class SetTopicInfoException extends Error {
    constructor(message = '대결 주제 정보를 확인할 수 없어요 :(', status = 500) {
        super(message);
        this.status = status;
        this.name = 'SetTopicInfoException';
    }
}

// 진행 엔트리 매치업 조회 Exception
export class CurrentEntryMatchException extends Error {
    constructor(message = '진행 할 엔트리 매치업 정보조회에 실패했어요', status = 500) {
        super(message);
        this.status = status;
        this.name = 'CurrentEntryMatchException';
    }
}

// 대결 결좌 제출 Exception
export class SubmitEntryMatchResultException extends Error {
    constructor(message = '대결 결과 제출에 실패했어요.', status = 500) {
        super(message);
        this.status = status;
        this.name = 'SubmitEntryMatchResultException';
    }
}