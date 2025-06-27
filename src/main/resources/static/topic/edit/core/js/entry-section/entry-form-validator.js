const entryNameMaxLength = 30;
const entryDescMaxLength = 200;

export const entryNameValidationMessage = '엔트리 명은 비어있어선 안되며, 최대 30자 까지 가능해요'
export const entryDescValidationMessage = '엔트리 설명은 비어있어선 안되며, 최대 200자 까지 가능해요.'
export const entryMediaValidationMessage = '이미지 또는 링크가 등록되지 않은 엔트리가 있어요.'

export function validateEntryName(entryName){
    if(!entryName) {
        return false;
    }
    if(entryName.trim().length === 0) return false;
    return entryName.length <= entryNameMaxLength;
}

export function validateEntryDescription(entryDesc){
    if(!entryDesc) {
        return false;
    }
    if(entryDesc.trim().length === 0) return false;
    return entryDesc.length <= entryDescMaxLength;
}

export function isValidEntryMedia(entryMedia){
    return !!entryMedia;
}