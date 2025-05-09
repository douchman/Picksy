import {generateFilePreviewURL} from "../../../../global/js/file.js";
import {createdTopic} from "./const.js";
import {showToastMessage} from "../../../../global/popup/js/common-toast-message.js";
import {createTopic, updateTopic} from "../../core/js/api/topic-edit-api.js";
import {TopicEditExceptionHandler} from "../../core/js/exception/topic-edit-exception-handler.js";
import {TopicCreateException, TopicUpdateException} from "../../core/js/exception/TopicEditException.js";

const topicEditExceptionHandler = new TopicEditExceptionHandler()

export function setupTopicSection(){
    addTopicSectionEvents();
}

function addTopicSectionEvents(){

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

        const topicCreateResult = await createTopic(requestBody);

        if( topicCreateResult){
            createdTopic.setId(topicCreateResult.topicId);
            return true;
        } else {
            topicEditExceptionHandler.handle(new TopicCreateException(validationResult.message, validationResult.status));
            return false;
        }
    }
    return false;
}

export async function modifyTopic(){
    const {validationResult , formData : {topicTitle, topicSubject, topicDesc, topicThumb, visibility }} = validateAndGenerateTopicFormData();

    if( validationResult ){
        const requestBody = new FormData();
        requestBody.append('title', topicTitle);
        requestBody.append('subject', topicSubject);
        requestBody.append('description', topicDesc);
        requestBody.append('thumbnail', topicThumb);
        requestBody.append('visibility', visibility);

        const topicUpdateResult = await updateTopic(requestBody);

        if(topicUpdateResult){
            return true;
        } else {
            topicEditExceptionHandler.handle(new TopicUpdateException(validationResult.message, validationResult.status));
            return false;
        }
    }
    return false;
}

function validateAndGenerateTopicFormData(){
    const topicTitle = document.querySelector('#topic-title').value;
    const topicSubject = document.querySelector('#topic-subject').value;
    const topicDesc = document.querySelector('#topic-desc').value;
    const topicThumb = document.querySelector('#topic-thumbnail').files[0];
    const visibility = document.querySelector('input[name="visibility"]:checked')?.value;

    if(!topicTitle || topicTitle === ''){
        showToastMessage('대결 제목을 입력해주세요', 'alert');
        return {validationResult : false, formData : {}}
    }

    if(!topicSubject || topicSubject === ''){
        showToastMessage('주요개념을 입력해주세요', 'alert');
        return {validationResult : false, formData : {}}
    }

    if(!topicDesc || topicDesc === ''){
        showToastMessage('대결 설명을 입력해주세요', 'alert');
        return {validationResult : false, formData : {}}
    }

    if(!topicThumb){
        showToastMessage('대표이미지를 등록해주세요', 'alert');
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