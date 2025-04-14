// 이미지 유형 미리보기
export function generateFilePreviewURL(file, callback){
    if(!file) {
       return;
    }
    if ( file ){
        const reader = new FileReader();

        reader.onload = function(e){
            callback(e.target.result);
        }

        reader.readAsDataURL(file);
    }
}

// 비디오 유형 미리보기
export function generateVideoPreviewRL(file, callback){
    if(!file){
        return;
    }

    if( file ){
        getThumbnailForVideo(file).then((imageUrl) =>{
            callback(imageUrl);
        });
    }
}

// 비디오 파일로부터 미리보기 이미지 생성
async function getThumbnailForVideo(videoFile) {
    const videoUrl = URL.createObjectURL(videoFile);
    const video = document.createElement("video");
    const canvas = document.createElement("canvas");
    video.style.display = "none";
    canvas.style.display = "none";

    // Trigger video load
    await new Promise((resolve, reject) => {
        video.addEventListener("loadedmetadata", () => {
            video.width = video.videoWidth;
            video.height = video.videoHeight;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            // Seek the video to 25%
            video.currentTime = video.duration * 0.25;
        });
        video.addEventListener("seeked", () => resolve());
        video.src = videoUrl;
    });

    // Draw the thumbnail
    canvas
        .getContext("2d")
        .drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    return canvas.toDataURL("image/png");
}

// 생성된 미리보기 이미지를 파일로 생성 ( blob -> file )
export function getThumbFileFromVideoUrl(videoUrl) {
    const [meta, base64] = videoUrl.split(',');
    const mime = meta.match(/:(.*?);/)[1];
    const binary = atob(base64);
    const array = Uint8Array.from(binary, c => c.charCodeAt(0));
    return blobToFile(new Blob([array], { type: mime }));
}

// blob -> file 변환
export function blobToFile(blob){
    return new File([blob], "thumbnail.jpg", {
        type: blob.type,
        lastModified: Date.now(),
    });
}