import {createInquiry} from "./inquiry-api.js";
import {buildValidatedInquiryPayload} from "./inquiry-from-builder.js";
import {showToastMessage} from "../../toast-message/js/common-toast-message.js";

document.addEventListener("DOMContentLoaded", function() {
    addInquiryButtonEvent()
});

// 문의 버튼 이벤트 등록
function addInquiryButtonEvent(){
    document.querySelector("#btn-inquiry").addEventListener("click", function() {
        setupInquiry();
    });
}

// 문의 셋업
function setupInquiry(){
    renderInquiry();
    addInquiryEvent();
}

// 문의 모달 랜더링
function renderInquiry(){
    const inquiryElement = `
    <div id="inquiry" class="inquiry">
        <div class="bg"></div>
        <div class="inquiry-body">
            <button type="button" class="close-inquiry"></button>
            <p class="body-title">📝 Picksy 에 문의하기</p>
            <div id="inquiry-form" class="inquiry-form">

                <div class="form-item">
                    <select id="inquiry-type" class="inquiry-type">
                        <option value="GENERAL" selected>이용 문의</option>
                        <option value="SUGGESTION">기능 제안</option>
                        <option value="ACCOUNT">계정 관련</option>
                        <option value="BUG">오류 제보</option>
                        <option value="ETC">기타</option>
                    </select>
                </div>

                <div class="form-item">
                    <input id="inquiry-author" class="inquiry-author" type="text" placeholder="문의자 성함" aria-valuemax="50">
                </div>

                <div class="form-item">
                    <input id="author-email" class="author-email" type="email" placeholder="이메일(답변 받을 이메일)" maxlength="250">
                </div>

                <div class="form-item">
                    <input id="inquiry-title" class="inquiry-title" type="text" placeholder="문의 제목" maxlength="250">
                </div>

                <div class="form-item">
                    <textarea id="inquiry-content" class="inquiry-content" placeholder="문의 내용"></textarea>
                </div>
            </div>
            
            <div class="btn-group">
                <button type="button" class="btn-register-inquiry">등록</button>
                <button type="button" class="btn-close-inquiry">취소</button>
            </div>
        </div>
    </div>`;

    document.querySelector('body').insertAdjacentHTML('beforeend', inquiryElement);
}

// 문의 이벤트 등록
function addInquiryEvent(){
    const inquiry = document.querySelector('#inquiry');
    inquiry.querySelector('.close-inquiry').addEventListener('click', closeInquiry);
    inquiry.querySelector('.btn-close-inquiry').addEventListener('click', closeInquiry);
    inquiry.querySelector('.btn-register-inquiry').addEventListener('click', registerInquiry);
}

// 문의 등록
async function registerInquiry(){
    if(isInquiryInProgress()) return;

    setInquiryProgressState(true);
    try {
        const {validationResult, inquiryPayload } = buildValidatedInquiryPayload();

        if(validationResult && inquiryPayload){
            await createInquiry(inquiryPayload); // 문의 등록
            showToastMessage({
                title : '문의 등록 완료',
                content : '소중한 의견 감사합니다. 빠른시일내로 답변드리겠습니다 :)'
            });
            closeInquiry();
        } else {
            setInquiryProgressState(false);
        }
    } catch(error){
        setInquiryProgressState(false);
        showToastMessage({
            toastType: 'error',
            title : '문의 등록 오류',
            content : error.message
        });
    }
}

// 문의 모달 닫기
function closeInquiry(){
    const inquiry = document.querySelector('#inquiry');
    if(inquiry){ inquiry.remove();}
}

// 문의 등록 진행 상태 설정
function setInquiryProgressState(isInProgress){
    const inquiry = document.querySelector('#inquiry');
    if(isInProgress) {
        inquiry.classList.add('in-progress');
    } else{
        inquiry.classList.remove('in-progress');
    }
}

// 문의 등록 진행 중 여부 확인
function isInquiryInProgress(){
    const inquiry = document.querySelector('#inquiry');

    return inquiry.classList.contains('in-progress');
}