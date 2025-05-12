import {stagedEntryMedia} from "../../modify/js/staged-entry-media.js";
import {createdTopic} from "./const/const.js";
import {showToastMessage} from "../../../../global/popup/js/common-toast-message.js";
import {isModifiedEntry} from "./const/initial-entry-map.js";
import {MediaType} from "../../../../global/js/const.js";

// 신규 등록 엔트리 form 데이터 검사 및 생성
export function buildValidatedEntryRegisterFormData(){
    const entryFormData = new FormData();
    const entryForm = document.querySelector('#entry-form');
    const entryItems = entryForm.querySelectorAll('.entry-item:not(.modify-entry)');

    for ( const [index, entryItem] of Array.from(entryItems).entries()){
        const entryItemId = entryItem.id;
        const entryName = entryItem.querySelector('.entry-name').value;
        const entryDescription = entryItem.querySelector('.entry-description').value;
        const entryMediaType = stagedEntryMedia[entryItemId].type;
        const entryMedia = stagedEntryMedia[entryItemId].media;
        const entryThumbnail = stagedEntryMedia[entryItemId].thumbnail;

        if(!entryMedia) {
            showToastMessage('이미지 또는 링크가 등록되지 않은 엔트리가 있어요', 'alert', 3000);
            return { validationResult : false, formData : {}};
        }

        entryFormData.append(`entries[${index}].entryName`, entryName);
        entryFormData.append(`entries[${index}].description`, entryDescription);

        if ( MediaType.YOUTUBE === entryMediaType  ) { // 파일 업로드 방식 엔트리
            entryFormData.append(`entries[${index}].mediaUrl`, entryMedia)
        } else { // 유튜브 링크 방식 엔트리
            entryFormData.append(`entries[${index}].mediaFile`, entryMedia)
        }

        if( entryThumbnail ){
            entryFormData.append(`entries[${index}].thumbnailFile`, entryThumbnail)
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
export function buildValidatedEntryModifyFormData(){
    const entryModifyFormData = new FormData();
    const entryForm = document.querySelector('#entry-form');
    const entryModifyItems = entryForm.querySelectorAll('.entry-item.modify-entry');

    for ( const [index, entryItem] of Array.from(entryModifyItems).entries()){
        const entryItemId = entryItem.id;
        const entryName = entryItem.querySelector('.entry-name').value;
        const entryDescription = entryItem.querySelector('.entry-description').value;
        const entryMediaType = stagedEntryMedia[entryItemId].type;
        const entryMedia = stagedEntryMedia[entryItemId].media;
        const entryThumbnail = stagedEntryMedia[entryItemId].thumbnail;

        const currentData = {
            entryName : entryName,
            description : entryDescription
        }

        if( isModifiedEntry(entryItemId, currentData)){
            entryModifyFormData.append(`entries[${index}].entryName`, entryName);
            entryModifyFormData.append(`entries[${index}].description`, entryDescription);

            if ( entryMedia  ) { // 새로 업로드 된 미디어파일 존재 시
                entryModifyFormData.append(`entries[${index}].mediaFile`, entryMedia);
            } else if(MediaType.YOUTUBE === entryMediaType) { // 유튜브 링크가 등록되었을 경우
                entryModifyFormData.append(`entries[${index}].mediaUrl`, entryMedia);
            }

            if( entryThumbnail ){ // 새로 업로드 된 썸네일 파일 존재 시
                entryModifyFormData.append(`entries[${index}].thumbnailFile`, entryThumbnail)
            }
        }
    }


    const isFormDataEmpty = entryModifyFormData.entries().next().done;

    if( isFormDataEmpty ) {
        return { validationResult : true, formData : null };
    }

    return { validationResult : true, formData : entryModifyFormData };
}
