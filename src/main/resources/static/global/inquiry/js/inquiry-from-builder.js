import {validateAuthor, validateEmail, validateTitle} from "./inquiry-validator.js";


export function buildValidatedInquiryPayload(){

    const inquiryType = document.querySelector('#inquiry-type').value;
    const author = document.querySelector('#inquiry-author').value;
    const email = document.querySelector('#author-email').value;
    const title = document.querySelector('#inquiry-title').value;
    const content = document.querySelector('#inquiry-content').value;

    if(!validateAuthor(author)){
        return { validationResult : false, inquiryPayload : null}
    }

    if(!validateEmail(email)){
        return { validationResult : false, inquiryPayload : null}
    }

    if(!validateTitle(title)){
        return { validationResult : false, inquiryPayload : null}
    }


    return { validationResult : true, inquiryPayload : {inquiryType, author, email, title, content} }
}
