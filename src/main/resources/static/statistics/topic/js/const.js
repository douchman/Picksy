export const topic = {
    id : null,
    title : null,

    setId(id) {
        this.id = id;
    },

    getId() {
        return this.id;
    }
}

export const entryStatsTable = {
    itemPerPage : 10,

    setItemPerPage(itemPerPage) {
        this.itemPerPage = itemPerPage;
    },

    getItemPerPage(){
        return this.itemPerPage;
    }
}