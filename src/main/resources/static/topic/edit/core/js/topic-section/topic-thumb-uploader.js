import {getPrSignedUploadUrl} from "../api/upload-url-api.js";
import {uploadSingleFileToS3} from "../uploadUtil.js";
import {TopicEditExceptionHandler} from "../exception/topic-edit-exception-handler.js";

const topicEditExceptionHandler = new TopicEditExceptionHandler();

export async function uploadTopicThumbnail(thumbnailFile){
    const requestBody = {
        requestFiles : [
            {
                originalFileName: thumbnailFile.name,
                contentType: thumbnailFile.type
            }
        ]
    }

    try {
        const uploadUrlResult = await getPrSignedUploadUrl(requestBody);
        const presignedFile =  extractSinglePresignedFile(uploadUrlResult);

        // direct upload to AWS S3
        await uploadSingleFileToS3(presignedFile.presignedUploadUrl, thumbnailFile);

        return {result : true , thumbnailUrl : presignedFile.objectKey};
    } catch(error){
        topicEditExceptionHandler.handle(error, {context : 'topicThumbUpload'});
        return {result : false , thumbnailUrl : null};
    }
}

/**
 * Presigned URL 응답에서 단일 presigned 파일 정보를 추출
 */
function extractSinglePresignedFile(response) {
    const list = response?.presignedFiles;

    if (!Array.isArray(list)) {
        throw new Error("presignedFiles is not [List] type");
    }

    if (list.length !== 1) {
        throw new Error(`list is not single presigned file`);
    }

    return list[0];
}
