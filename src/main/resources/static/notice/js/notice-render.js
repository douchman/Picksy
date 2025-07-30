import {getNotice} from "./notice-api.js";
import {noticeSearchParams, NoticeType} from "./notice-const.js";

export async function renderNotice(){
    const noticeResult = await getNotice(noticeSearchParams.sanitizeParams());
    const noticeCards = document.querySelector('#notice-cards');

    const noticeList = noticeResult.noticeList;
    const {currentPage, totalPages} = noticeResult.pagination;

    // 공지 리스트가 비었음
    if(isNoticeListEmpty(noticeList)){
        toggleNoticeCardsEmpty(true);
        return { hasMore : false};
    }

    toggleNoticeCardsEmpty(false);
    noticeList.forEach(({id, noticeType, title, summary, createdAt}) => {
        const noticeCard = `
            <div class="notice-card ${NoticeType.getNoticeClassByType(noticeType)}" data-id="${id}">
                <div class="card-header">
                    <label class="lbl-notice-type">${NoticeType.getNoticeLabelByType(noticeType)}</label>
                    <p class="timestamp">${formatDateToYMD(createdAt)}</p>
                </div>
                <div class="card-body">
                    <p class="notice-title">${title}</p>
                    <p class="summary">${summary}</p> 
                    <p class="content"></p>
                </div>
            </div>`;
        noticeCards.insertAdjacentHTML('beforeend', noticeCard);
    });

    return { hasMore : hasNextPage(currentPage, totalPages)};
}

export function renderNoticeDetailContent(noticeCard, noticeDetails){
    const {noticeDetail : {content}} = noticeDetails;
    noticeCard.querySelector('.content').innerHTML = content;
}

export function removeAllNoticeCards(){ // 랜더링 된 피드 카드 모두 제거
    document.querySelectorAll('#notice-cards .notice-card').forEach( card => card.remove());
}

function isNoticeListEmpty(noticeList){
    return !noticeList || noticeList.length < 1;
}

function hasNextPage(currentPage = 1 , totalPages = 1 ){
    return currentPage < totalPages;
}

function toggleNoticeCardsEmpty(isEmpty){
    const noticeCards = document.querySelector('#notice-cards');
    noticeCards.classList.toggle('empty', isEmpty);
}

/**
 * 날짜 형식 변환
 * @param datetimeStr
 * @description 서버에서 이미 format 을 설정해서 내려주므로 date 처리는 안정적으로 동작하도록 split 으로 처리
 */
function formatDateToYMD(datetimeStr) {
    const [datePart] = datetimeStr.split(' ');
    return datePart; // yyyy-mm-dd 형식 유지
}