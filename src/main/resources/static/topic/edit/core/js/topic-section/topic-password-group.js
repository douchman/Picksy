import {Visibility} from "../../../../../global/const/const.js";

export function toggleAccessCodeGroupByVisibility(visibility){
    Visibility.PASSWORD === visibility ? showAccessCodeGroup() : hideAccessCodeGroup();
}

function showAccessCodeGroup(){
    const accessCodeGroup = document.querySelector('#access-code-group');
    accessCodeGroup.classList.add('show');
}

function hideAccessCodeGroup(){
    const accessCodeGroup = document.querySelector('#access-code-group');
    const accessCode = document.querySelector('#access-code');
    accessCode.value = '';
    accessCodeGroup.classList.remove('show');
}