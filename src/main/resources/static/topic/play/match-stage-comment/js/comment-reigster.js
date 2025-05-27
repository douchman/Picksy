import {topic} from "../../js/const.js";
import {showToastMessage} from "../../../../global/popup/js/common-toast-message.js";
import {
    authorValidationMessage,
    commentContentValidationMessage,
    validateAuthor,
    validateCommentContent
} from "./comment-register-validation.js";
import {CommentsExceptionHandler} from "../../js/exception/comment-exception-handler.js";
import {createComment} from "./comment-api.js";
import {RegisterCommentException} from "../../js/exception/CommentException.js";

const commentExceptionHandler = new CommentsExceptionHandler();
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
            author : `${document.querySelector('#author').value} <i>(${getWinnerEntryName()})</i>`,
            content : document.querySelector('#comment-content').value,
        }

        const commentCreateResult = await createComment(topic.getId(), registerRequestBody);

        if( commentCreateResult ){
            initCommentRegisterForm(); // 코멘트 form 초기화
            commentListScrollTop(); // 스크롤 최상단
            setTimeout(() => {
                renderRegisteredComment(commentCreateResult.author, commentCreateResult.content, commentCreateResult.createdAt);
            }, 300); // 지연 후 랜더링

        } else{
            commentExceptionHandler.handle(new RegisterCommentException(commentCreateResult.message));
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

function getWinnerEntryName(){
    const winnerEntry = document.querySelector('.winner-entry');
    return winnerEntry.querySelector('.entry-name').textContent;
}
