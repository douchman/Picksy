export const API_URL = 'http://localhost:8080/';

export const MediaType = {
    IMAGE : 'IMAGE',
    VIDEO : 'VIDEO',
    YOUTUBE : 'YOUTUBE',

    isMediaTypeImage(mediaType){
        return mediaType === this.IMAGE;
    },

    isMediaTypeYouTube(mediaType){
        return mediaType === this.YOUTUBE;
    }
}