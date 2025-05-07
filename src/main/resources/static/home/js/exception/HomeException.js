export class TopicSearchException extends Error {
    constructor(message = '대결주제 조회 오류', status = 500) {
        super(message);
        this.status = status;
        this.name = 'TopicSearchException';
    }
}

export class TournamentException extends Error {
    constructor(message = '대결주제 토너먼트 조회 오류', status = 500) {
        super(message);
        this.status = status;
        this.name = 'TournamentException';
    }
}
