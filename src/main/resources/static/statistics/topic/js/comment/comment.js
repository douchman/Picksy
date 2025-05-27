import {apiGetRequest} from "../../../../global/js/api.js";
import {topic} from "../const.js";
import {addCommentRegisterEvent} from "./comment-register.js";

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

/* 유저 코멘트 셋업 */
// 코멘트 무한 스크롤 설정
// 코멘트 관련 이벤트 등록
export function setupUserComment(){
    setupCommentInfiniteScrollObserver();
    addCommentsEvents();
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
    const {status, data : {commentList, pagination}} = await getComments(commentsQuery);

    if( status === 200 && commentList && commentList.length !== 0){
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

// 댓글 조회
async function getComments(requestParams){
    return await apiGetRequest(`topics/${topic.getId()}/comments`, {} , requestParams);
}