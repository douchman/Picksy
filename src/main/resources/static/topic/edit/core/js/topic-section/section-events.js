import {generateFilePreviewURL} from "../../../../../global/util/file.js";
import {initialTopic} from "../const/initial-topic.js";
import {toggleAccessCodeGroupByVisibility} from "./topic-password-group.js";

export function addTopicSectionEvents(){

    document.querySelector('#topic-thumbnail').addEventListener('change', function(e){
        const topicThumbnail = document.querySelector('#topic-thumbnail-preview');
        const file = e.target.files[0];

        generateFilePreviewURL(file, (url) =>{
            if(url){
                topicThumbnail.style.backgroundImage = `url(${url})`;
                topicThumbnail.classList.add('uploaded');
                markTopicThumbnailAsChanged();
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
                markTopicThumbnailAsChanged();
            }
        });
        this.classList.remove('drag-over');
    });

    document.querySelector('#visibility-radio-group').addEventListener('change', function(e){
        if(e.target.matches('input.visibility-radio')){
            changeInitialTopicVisibility(e.target);
        }
    });

    document.querySelectorAll('input[name="visibility"]').forEach(function(visibilityRadio){
        visibilityRadio.addEventListener('change', function(){
            toggleAccessCodeGroupByVisibility(this.value);
        });
    });
}

function changeInitialTopicVisibility(visibilityRadio){
    initialTopic.visibility = visibilityRadio.value;
}

function markTopicThumbnailAsChanged(){
    initialTopic.isThumbnailChanged = true;
}

