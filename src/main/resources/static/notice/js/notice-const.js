export const NoticeType = {
    DEFAULT : {type : 'DEFAULT', label : '공지', class : ''},
    UPDATE : {type : 'UPDATE', label : '업데이트', class : 'update'},
    EVENT : {type : 'EVENT', label : '이벤트', class : 'event'},
    ALERT : {type : 'ALERT', label : '긴급안내', class : 'alert'},
    MAINTENANCE : {type : 'MAINTENANCE', label : '점검안내', class : 'maintenance'},

    getNoticeLabelByType(type){
        return NoticeType[type]?.label || this.DEFAULT.label;
    },

    getNoticeClassByType(type){
        return NoticeType[type]?.class || this.DEFAULT.class;
    }

}

export const noticeSearchParams = {
    noticeType : '',
    keyword : '',
    page : 1,
    size : 16,

    increasePage(){
        this.page++;
    },

    initPage(){
        this.page = 1;
    },

    sanitizeParams(){ // 비어있는 params 제거
        return Object.entries({
            noticeType : this.noticeType,
            keyword : this.keyword,
            page : this.page,
            size : this.size,
        }).filter(([_, value]) => value !== null && value !== undefined && value !== '')
    }
}