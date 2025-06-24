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
