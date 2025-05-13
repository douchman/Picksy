export const createdTopic = {
    id : null,

    getId(){
        return this.id;
    },

    setId(id){
        this.id = id;
    },

    isTopicCreated(){
        return (this.id !== null && this.id !== undefined);
    }
}