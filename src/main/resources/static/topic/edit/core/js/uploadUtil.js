/* 단일 파일 S3 업로드 */
export async function uploadSingleFileToS3(presignedUrl, file){
    try {
        const response = await fetch(presignedUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': file.type
            },
            body: file
        });

        return response.ok;

    } catch (error) {
        throw Error(error);
    }
}

export async function uploadMultipleFilesToS3(uploadFileList){
    try{

        const uploadResult = await Promise.allSettled(
            uploadFileList.map(uploadFile =>
            fetch(uploadFile.presignedUploadUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': uploadFile.file.type
                },
                body: uploadFile.file
            }))
        );

        return isAllUploadSuccessful(uploadResult);

    }catch(error){
        throw new Error(error.message || String(error));
    }
}

function isAllUploadSuccessful(uploadResult){
    const rejected = uploadResult.filter(r => r.status === 'rejected');
    return rejected.length <= 0;
}