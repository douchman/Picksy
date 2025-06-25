import {getPrSignedUploadUrl} from "../api/upload-url-api.js";
import {EntryEditExceptionHandler} from "../exception/entry-edit-exception-handler.js";
import {stagedEntryMedia} from "../staged-entry-media.js";
import {MediaType} from "../../../../../global/const/const.js";
import {uploadMultipleFilesToS3} from "../uploadUtil.js";

const entryExceptionHandler = new EntryEditExceptionHandler();

export async function uploadEntriesMedia(){

    const entryMediaUploadItems = buildEntryMediaUploadItems(); // stagedMedia 를 기준으로 리스트 재구성
    const presignedUrlRequestPayload = buildPresignedUrlRequestPayload(entryMediaUploadItems);
    const presignedResult = await getPrSignedUploadUrl(presignedUrlRequestPayload);
    const presignedFileMetas = presignedResult.presignedFiles;
    const mergedEntryMediaUploadItems = mergerPresignedData(entryMediaUploadItems, presignedFileMetas);

    const groupedEntryMedia = groupEntryMediaByEntryId(mergedEntryMediaUploadItems);

    try {
        await uploadMultipleFilesToS3(mergedEntryMediaUploadItems);
        return {uploadSuccess : true , groupedEntryMedia};
    }catch(error){
        entryExceptionHandler.handle(error, {context : 'entryMediaUpload'});
        return {uploadSuccess : false , groupedEntryMedia : {}};
    }
}

// stagedEntryMedia 를 기반으로 entryID 로 구분된 uploadItem list 빌드
function buildEntryMediaUploadItems(){
    const entryMediaUploadItems = [];

    Object.entries(stagedEntryMedia).forEach(([entryId, entry]) => {

        const type = entry.type;

        if( type === MediaType.IMAGE && entry.media){
            entryMediaUploadItems.push({entryId, mediaType : type, fileRole : 'image', file : entry.media});
        } else if( type === MediaType.VIDEO){
            if(entry.media){ entryMediaUploadItems.push({entryId, mediaType : type, fileRole: 'video', file : entry.media});}
            if(entry.thumbnail){ entryMediaUploadItems.push({entryId, mediaType : type, fileRole: 'thumbnail', file : entry.thumbnail});}
        } else if( type === MediaType.YOUTUBE && entry.thumbnail ){
            entryMediaUploadItems.push({entryId, mediaType : type, fileRole: 'thumbnail', file : entry.thumbnail});
        }
    });

    return entryMediaUploadItems;
}

// upload url 요청을 위한 request body build
function buildPresignedUrlRequestPayload(entryMediaUploadItems){
    return {
        requestFiles : entryMediaUploadItems.map(item => ({
            originalFileName : item.file.name,
            contentType : item.file.type
        }))
    }
}

// 최종적으로 사용할 리스트에 서버로부터 전달된 objectKey 와 uploadUrl 병합
function mergerPresignedData(entryMediaUploadItems, presignedFileMetas){
    // 순서가 보장되는 결과이기때문에 idx 로 매치
    return entryMediaUploadItems.map((item, idx) => ({
        ...item,
        objectKey : presignedFileMetas[idx].objectKey,
        presignedUploadUrl : presignedFileMetas[idx].presignedUploadUrl,
        //mediaType : presignedFileMetas[idx].mediaType,
    }))
}

// entryId 를 기준으로 fileRole 을 key 로 삼아 그룹화
function groupEntryMediaByEntryId(mergedEntryMediaUploadItems){
    const groupedEntryMedia = {};

    mergedEntryMediaUploadItems.forEach(item => {
        const { entryId, mediaType, fileRole, ...rest } = item;

        if(!groupedEntryMedia[entryId]){
            groupedEntryMedia[entryId] = {};
        }
        groupedEntryMedia[entryId].mediaType = mediaType;
        groupedEntryMedia[entryId][fileRole] = { ... rest};

        if(mediaType === MediaType.YOUTUBE){
            groupedEntryMedia[entryId].youtubeUrl = stagedEntryMedia[entryId].media;
        }

    });

    return groupedEntryMedia;
}
