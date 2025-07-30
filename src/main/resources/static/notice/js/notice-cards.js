import {getNoticeDetail} from "./notice-api.js";
import {renderNoticeDetailContent} from "./notice-render.js";

export function setupNoticeCards(){
    addNoticeCardEvents();
}

function addNoticeCardEvents(){
    document.querySelector('#notice-cards').addEventListener('click', async function(event){
        const noticeCard = event.target.closest('.notice-card');
        if(noticeCard){
            await fetchAndFillNoticeDetail(noticeCard);
        }
    });
}

async function fetchAndFillNoticeDetail(noticeCard){
    const noticeId = Number(noticeCard.dataset.id);
    const noticeDetails = await getNoticeDetail(noticeId);
    renderNoticeDetailContent(noticeCard, noticeDetails);
    toggleNoticeCardOpen(noticeCard);
}

// 카드 토글하여 오픈
// 부드러운 애니메이션을 위해 reflow 로 처리
function toggleNoticeCardOpen(noticeCard){
    const content = noticeCard.querySelector('.content');
    if (noticeCard.classList.contains('open')) {
        content.style.maxHeight = content.scrollHeight + 'px';
        // 강제로 reflow 발생
        void content.offsetHeight;
        content.style.maxHeight = '0px';
        noticeCard.classList.remove('open');
    } else {
        content.style.maxHeight = content.scrollHeight + 'px';
        noticeCard.classList.add('open');
    }
}