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

export const Visibility = {
    PUBLIC : 'PUBLIC',
    PRIVATE : 'PRIVATE',
    UNLISTED : 'UNLISTED',

    getVisibilityName(visibility){
        if( this.PUBLIC === visibility ) {
            return '🔓 공개';
        }

        if( this.PRIVATE === visibility ) {
            return '🔒 비공개';
        }

        if( this.UNLISTED === visibility ) {
            return '🔗링크'
        }
    },

    isAvailableVisibility(visibility){
        return Object.values(this).includes(visibility);
    }
}

/* 비속어 필터 상태 값 */
export const ModerationStatus = { 
    WAITING: 'WAITING',
    PASSED : 'PASSED',
    BLOCKED : 'BLOCKED',
    ERROR : 'ERROR'
}