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