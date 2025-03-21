import {generateFilePreviewURL} from "../../../global/js/file.js";
import {apiFormDataRequest} from "../../../global/js/api.js";
import {setTopicId} from "./const.js";

export function addTopicCreateEvents(){

    document.querySelector('#topic-thumbnail').addEventListener('change', function(e){
        const topicThumbnail = document.querySelector('#topic-thumbnail-preview');
        const file = e.target.files[0];

        generateFilePreviewURL(file, (url) =>{
            if(url){
                topicThumbnail.style.backgroundImage = `url(${url})`;
                topicThumbnail.classList.add('uploaded');
            }
        });
    });

    document.querySelector('#topic-thumbnail-preview').addEventListener('dragover', function(e){
        e.preventDefault();
        this.classList.add('drag-over');
    });

    document.querySelector('#topic-thumbnail-preview').addEventListener('dragleave', function(e){
        e.preventDefault();
        this.classList.remove('drag-over');
    });

    document.querySelector('#topic-thumbnail-preview').addEventListener('drop', function(e){
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        const topicThumbnail = this;
        const fileInput = document.querySelector('#topic-thumbnail');
        generateFilePreviewURL(file, (url) =>{
            if(url){
                topicThumbnail.style.backgroundImage = `url(${url})`;
                topicThumbnail.classList.add('uploaded');

                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                fileInput.files = dataTransfer.files;
            }
        });
        this.classList.remove('drag-over');
    });
}

export async function registerTopic(){
    const {validationResult , formData : {topicTitle, topicSubject, topicDesc, topicThumb, visibility }} = validateAndGenerateTopicFormData();

    if( validationResult ){
        const requestBody = new FormData();
        requestBody.append('title', topicTitle);
        requestBody.append('subject', topicSubject);
        requestBody.append('description', topicDesc);
        requestBody.append('thumbnail', topicThumb);
        requestBody.append('visibility', visibility);

        const {status, data : registerResult } = await postTopic(requestBody);

        if( status === 200){
            setTopicId(registerResult.topicId);
        }

    }

}

function validateAndGenerateTopicFormData(){
    const topicTitle = document.querySelector('#topic-title').value;
    const topicSubject = document.querySelector('#topic-subject').value;
    const topicDesc = document.querySelector('#topic-desc').value;
    const topicThumb = document.querySelector('#topic-thumbnail').files[0];
    const visibility = document.querySelector('input[name="visibility"]:checked')?.value;

    if(!topicTitle || topicTitle === ''){
        alert('대결 제목을 입력해주세요'); // 임시
        return {validationResult : false, formData : {}}
    }

    if(!topicSubject || topicSubject === ''){
        alert('주요개념을 입력해주세요'); // 임시
        return {validationResult : false, formData : {}}
    }

    if(!topicDesc || topicDesc === ''){
        alert('대결 설명을 입력해주세요'); // 임시
        return {validationResult : false, formData : {}}
    }

    if(!topicThumb){
        alert('대표이미지를 등록해주세요.'); // 임시
        return {validationResult : false, formData : {}}
    }

    return {
        validationResult : true,
        formData:  {
            topicTitle : topicTitle,
            topicSubject : topicSubject,
            topicDesc : topicDesc,
            topicThumb : topicThumb,
            visibility :visibility

        }
    };
}

async function postTopic(requestBody){
    return apiFormDataRequest('topics', {}, requestBody);
}