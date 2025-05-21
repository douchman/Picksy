export const topic = {
    id : null,
    title : null,

    setId(id) {
        this.id = id;
    },

    getId() {
        return this.id;
    },

    setTitle(title) {
        this.title = title
    },

    getTitle(){
        return this.title;
    }
}

export const playRecordStorage = {
    key : 'playRecordId',

    saveId(id){
        sessionStorage.setItem(this.key, String(id));
    },
    loadId(){
        const playRecordId = sessionStorage.getItem(this.key);
        return playRecordId ? Number(playRecordId) : null;
    },
    exists(){
        return !!sessionStorage.getItem(this.key);
    }
}

export const match = {
    id : null,

    setId(id){
        this.id = id;
    },

    getId(){
        return this.id;
    }
}