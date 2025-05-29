export const ApiMethod = {
    GET : 'GET',
    POST : 'POST',
    PUT : 'PUT',
    PATCH :'PATCH',
    DELETE : 'DELETE',

    isJsonRequest(method){
        return (method === this.POST || method === this.PATCH || method === this.PUT);
    }
}