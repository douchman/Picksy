import {stagedEntryMedia} from "../staged-entry-media.js";
import {createdTopic} from "../const/const.js";
import {showToastMessage} from "../../../../../global/toast-message/js/common-toast-message.js";
import {initialEntryDataMap, isModifiedEntry} from "../const/initial-entry-map.js";
import {MediaType} from "../../../../../global/const/const.js";
import {uploadEntriesMedia} from "./entry-media-uploader.js";

// 신규 등록 엔트리 form 데이터 검사 및 생성
export async function buildValidatedEntryRegisterFormData(){
    const entryFormData = new FormData();
    const entryForm = document.querySelector('#entry-form');
    const entryItems = entryForm.querySelectorAll('.entry-item:not(.modify-entry)');

    if(validatedEntryRegisterForm()){
        const {uploadSuccess, groupedEntryMedia } = await uploadEntriesMedia();

        if(uploadSuccess){
            for ( const [index, entryItem] of Array.from(entryItems).entries()){
                const entryItemId = entryItem.id;
                const entryName = entryItem.querySelector('.entry-name').value;
                const entryDescription = entryItem.querySelector('.entry-description').value;
                const entryMediaType = groupedEntryMedia[entryItemId].mediaType;

                entryFormData.append(`entries[${index}].entryName`, entryName);
                entryFormData.append(`entries[${index}].description`, entryDescription);
                entryFormData.append(`entries[${index}].mediaType`, entryMediaType);

                if( entryMediaType === MediaType.IMAGE){
                    const imageUrl = groupedEntryMedia[entryItemId].image.objectKey;
                    entryFormData.append(`entries[${index}].mediaUrl`, imageUrl);
                } else if( entryMediaType === MediaType.VIDEO){
                    const thumbnailUrl = groupedEntryMedia[entryItemId].thumbnail.objectKey;
                    const videoUrl = groupedEntryMedia[entryItemId].video.objectKey;
                    entryFormData.append(`entries[${index}].mediaUrl`, videoUrl);
                    entryFormData.append(`entries[${index}].thumbnail`, thumbnailUrl);
                } else if( entryMediaType === MediaType.YOUTUBE){
                    const thumbnailUrl = groupedEntryMedia[entryItemId].thumbnail.objectKey;
                    const youtubeUrl = groupedEntryMedia[entryItemId].youtubeUrl;
                    entryFormData.append(`entries[${index}].mediaUrl`, youtubeUrl);
                    entryFormData.append(`entries[${index}].thumbnail`, thumbnailUrl);
                }
            }
        } else {
            return { validationResult : false, formData : null };
        }
    }

    const isFormDataEmpty = entryFormData.entries().next().done;

    if( isFormDataEmpty ) {
        return { validationResult : true, formData : null };
    }

    entryFormData.append('topicId', createdTopic.getId());

    return { validationResult : true, formData : entryFormData };
}

// 업데이트 엔트리 form 데이터 검사 및 생성
export async function buildValidatedEntryModifyFormData(){
    const entryModifyFormData = new FormData();
    const entryForm = document.querySelector('#entry-form');
    const entryModifyItems = entryForm.querySelectorAll('.entry-item.modify-entry');

    const {uploadSuccess, groupedEntryMedia } = await uploadEntriesMedia();

    if(!uploadSuccess) return { validationResult : false, formData : null };

    for ( const [index, entryItem] of Array.from(entryModifyItems).entries()){
        const entryItemId = entryItem.id;
        const entryName = entryItem.querySelector('.entry-name').value;
        const entryDescription = entryItem.querySelector('.entry-description').value;
        const entryMediaType = stagedEntryMedia[entryItemId].type;
        const isMediaChanged = initialEntryDataMap[entryItemId].isMediaChanged; // 미디어 변경 여부

        const currentData = {
            entryName : entryName,
            description : entryDescription
        }

        const isRemoveTargetEntry = entryItem.classList.contains('removed');
        if( isRemoveTargetEntry ) {
            entryModifyFormData.append(`entriesToUpdate[${index}].id`, entryItemId);
            entryModifyFormData.append(`entriesToUpdate[${index}].delete`, "true");

        } else if( isModifiedEntry(entryItemId, currentData)){
            entryModifyFormData.append(`entriesToUpdate[${index}].id`, entryItemId);
            entryModifyFormData.append(`entriesToUpdate[${index}].entryName`, entryName);
            entryModifyFormData.append(`entriesToUpdate[${index}].description`, entryDescription);
            entryModifyFormData.append(`entriesToUpdate[${index}].delete`, "false");

            if( uploadSuccess && isMediaChanged){
                if( entryMediaType === MediaType.IMAGE){
                    const imageUrl = groupedEntryMedia[entryItemId].image.objectKey;
                    entryModifyFormData.append(`entriesToUpdate[${index}].mediaUrl`, imageUrl);
                } else if( entryMediaType === MediaType.VIDEO){
                    const thumbnailUrl = groupedEntryMedia[entryItemId].thumbnail.objectKey;
                    const videoUrl = groupedEntryMedia[entryItemId].video.objectKey;
                    entryModifyFormData.append(`entriesToUpdate[${index}].mediaUrl`, videoUrl);
                    entryModifyFormData.append(`entriesToUpdate[${index}].thumbnail`, thumbnailUrl);
                } else if( entryMediaType === MediaType.YOUTUBE){
                    const thumbnailUrl = groupedEntryMedia[entryItemId].thumbnail.objectKey;
                    const youtubeUrl = groupedEntryMedia[entryItemId].youtubeUrl;
                    entryModifyFormData.append(`entriesToUpdate[${index}].mediaUrl`, youtubeUrl);
                    entryModifyFormData.append(`entriesToUpdate[${index}].thumbnail`, thumbnailUrl);
                }

                entryModifyFormData.append(`entriesToUpdate[${index}].mediaType`, entryMediaType);
            }

        }
    }

    const isFormDataEmpty = entryModifyFormData.entries().next().done;

    if( isFormDataEmpty ) {
        return { validationResult : true, formData : null };
    }

    return { validationResult : true, formData : entryModifyFormData };
}

function validatedEntryRegisterForm(){
    const entryForm = document.querySelector('#entry-form');
    const entryItems = entryForm.querySelectorAll('.entry-item:not(.modify-entry)');

    for ( const [entryItem] of Array.from(entryItems).entries()){
        const entryItemId = entryItem.id;
        /*const entryName = entryItem.querySelector('.entry-name').value;
        const entryDescription = entryItem.querySelector('.entry-description').value;*/
        const entryMedia = stagedEntryMedia[entryItemId].media;

        if(!entryMedia) {
            showToastMessage('이미지 또는 링크가 등록되지 않은 엔트리가 있어요', 'alert', 3000);
            return false;
        }
    }
    return true;
}
