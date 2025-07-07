import {addCommentRegisterEvent} from "./comment-reigster.js";
import {topic} from "../../js/const.js";
import {getComments} from "./comment-api.js";
import {CommentsExceptionHandler} from "./exception/comment-exception-handler.js";

let commentListScrollObserver; // 유저 코멘트 리스트 스크롤 옵저버
let isFetchingComments = false; // 데이터 조회 플래그

const commentsQuery = { // 코멘트 조회 요청 쿼리
    keyword : '',
    page : 1,
    size : 8,
}

let commentsPagination = { // 페이지네이션 전역변수
    currentPage : 1,
    totalPages : 0
}

const commentExceptionHandler = new CommentsExceptionHandler();

/* 코멘트 셋업 */
// 코멘트 창 랜더링
// 옵저버 셋업
// 이벤트 등록
export function setupMatchStageComment(){
    renderTopicComment();
    setupCommentInfiniteScrollObserver();
    addCommentsEvents();
}

// 코멘트 창 랜더링
function renderTopicComment(){
    const topicComment =
        `<div id="topic-comment" class="topic-comment">
            <div class="comment-wrapper">
                <p class="t-index">유저 코멘트<b id="comment-count" class="comment-count"></b></p>
                <div id="comment-list-wrapper" class="comment-list-wrapper">
                    <div id="comment-list" class="comment-list empty"></div>
                </div>
                <div class="comment-form">
                    <p class="form-header">코멘트 남기기</p>
                    <div class="form-item comment-author">
                        <label for="author">닉네임</label>
                        <input id="author" class="author" type="text" value="익명">
                    </div>

                    <div class="form-item">
                        <label for="comment-content">코멘트 내용</label>
                        <textarea id="comment-content" class="comment-content"></textarea>
                    </div>

                    <div class="bottom-btn-group">
                        <a class="move-to-topic-stats" href="/statistics/topic/${topic.getId()}">📊 통계</a>
                        <button id="btn-register-comment" class="btn-register-comment" type="button">✍️ 코멘트 남기기</button>
                    </div>
                </div>
            </div>
        </div>`;

    document.querySelector('#match-stage').insertAdjacentHTML('beforeend', topicComment);
}


// 코멘트 리스트 무한스크롤 옵저버 타겟 랜더링
function renderScrollObserverTarget(){
    const scrollObserverTarget = `<div id="scroll-observer-target" class="scroll-observer-target"></div>`
    document.querySelector('#comment-list-wrapper').insertAdjacentHTML('beforeend', scrollObserverTarget);
}

// 무한스크롤 옵저버 설정
function setupCommentInfiniteScrollObserver(){
    renderScrollObserverTarget();

    const scrollObserverTarget = document.querySelector('#scroll-observer-target');

    commentListScrollObserver = new IntersectionObserver(async ([entry]) => {
        if(entry.isIntersecting && !isFetchingComments){
            isFetchingComments = true;
            await renderComments();
            if(hasNextCommentPage()){
                commentsQuery.page += 1;
            } else {
                stopCommentListScrollObserver();
            }
            isFetchingComments = false;
        }
    }, {
        root : null,
        rootMargin : '0px',
        threshold: 1.0
    });

    commentListScrollObserver.observe(scrollObserverTarget);
}

// 댓글 이벤트 추가
function addCommentsEvents(){
    addCommentRegisterEvent(); // 댓글 작성 이벤트
}

// 옵저버 중지
function stopCommentListScrollObserver(){
    const scrollObserverTarget = document.querySelector('#scroll-observer-target');
    commentListScrollObserver.unobserve(scrollObserverTarget);
}

// 코멘트 랜더링
async function renderComments(){
    try {
        const commentResult = await getComments(topic.getId(), commentsQuery);

        const commentList = commentResult.commentList;
        const pagination = commentResult.pagination;

        if( commentList && commentList.length !== 0){
            renderTotalCommentCount(pagination.totalItems);
            removeCommentListEmpty(); // 비었음 스타일 제거
            savePagination(pagination);

            commentList.forEach((comment) =>{
                const commentItem =
                    `<div class="comment">
                    <div class="comment-header">
                        <p class="author">${comment.author}</p>
                        <span class="time-stamp">${comment.createdAt}</span>
                        <button class="btn-report" type="button"></button>
                    </div>
                    <p class="content">${comment.content}</p>
                </div>`;

                document.querySelector('#comment-list').insertAdjacentHTML('beforeend', commentItem);
            });
        }
    } catch (error){
        commentExceptionHandler.handle(error, {context : 'getComments'});
    }
}

// 총 코멘트 개수 랜더링
function renderTotalCommentCount(totalCommentCount){
    document.querySelector('#comment-count').innerHTML = totalCommentCount;
}


// 다음 페이지 여부 검증
function hasNextCommentPage(){
    return commentsPagination.currentPage < commentsPagination.totalPages;
}

// 페이지네이션 전역변수 저장
function savePagination(pagination){
    if( pagination ){
        commentsPagination.currentPage = pagination.currentPage;
        commentsPagination.totalPages = pagination.totalPages;
    }
}

// 댓글 비었음 스타일 해제
function removeCommentListEmpty(){
    document.querySelector('#comment-list').classList.remove('empty');
}