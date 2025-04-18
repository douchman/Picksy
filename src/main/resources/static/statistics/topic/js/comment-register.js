import {apiPostRequest} from "../../../global/js/api.js";
import {topic} from "./const.js";
import {showToastMessage} from "../../../global/popup/js/common-toast-message.js";
import {
    authorValidationMessage,
    commentContentValidationMessage,
    validateAuthor,
    validateCommentContent
} from "./comment-register-validate.js";

// 댓글 작성 이벤트
export function addCommentRegisterEvent(){
    document.querySelector('#btn-register-comment').addEventListener('click', async function(){
        await registerComment();
    });
}

// 댓글 작성
async function registerComment(){
    toggleRegisterButtonBlock(true);

    if( validateCommentForm()){
        const registerRequestBody = {
            author : document.querySelector('#author').value,
            content : document.querySelector('#comment-content').value,
        }

        const {status, data : registerResult } = await postComments(registerRequestBody);

        if( status === 200 ){
            initCommentRegisterForm(); // 코멘트 form 초기화
            commentListScrollTop(); // 스크롤 최상단
            setTimeout(() => {
                renderRegisteredComment(registerResult.author, registerResult.content, registerResult.createdAt);
            }, 300); // 지연 후 랜더링

        } else{
            showToastMessage('댓글 작성에 문제가 발생했어요. 잠시 후 다시 시도해 주세요');
        }
    }

    toggleRegisterButtonBlock(false);
}

// 작성된 댓글 랜더링
function renderRegisteredComment(author, content, createdAt){
    const commentList = document.querySelector('#comment-list');
    const registeredComment =
        `<div class="comment blink">
            <div class="comment-header">
                <p class="author">${author}</p>
                <span class="time-stamp">${createdAt}</span>
                <button class="btn-report" type="button"></button>
            </div>
            <p class="content">${content}</p>
        </div>`;

    commentList.insertAdjacentHTML('afterbegin', registeredComment);
    commentList.classList.remove('empty');
}

// 코멘트 남기기 버튼 disable 제어
function toggleRegisterButtonBlock(isBlock = false){
    const btnRegisterComment = document.querySelector('#btn-register-comment');
    isBlock ?
        btnRegisterComment.disabled = true
        : btnRegisterComment.disabled = false
}

// 댓글 창 스크롤 최상단으로 이동
function commentListScrollTop(){
    document.querySelector('#comment-list-wrapper').scrollTop = 0;
}

// 댓글 작성 창 초기화
function initCommentRegisterForm(){
    document.querySelector('#author').value = '익명';
    document.querySelector('#comment-content').value = '';
}

function validateCommentForm(){

    // 작성자 명
    const author = document.querySelector('#author').value;
    const commentContent = document.querySelector('#comment-content').value;

    if(!validateAuthor(author)){
        showToastMessage(authorValidationMessage, 'alert', 3500);
        return false;
    }

    else if(!validateCommentContent(commentContent)){
        showToastMessage(commentContentValidationMessage, 'alert', 3500);
        return false;
    }

    return true;
}

// 댓글 작성 api
async function postComments(requestBody){
    return await apiPostRequest(`topics/${topic.getId()}/comments`, {}, requestBody)
}