const MAX_TOAST_MESSAGE_COUNT = 3;

/**
 *
 * @param {{
 *     toastType? : '' | 'alert' | 'error',
 *     title?: string,
 *     content?: string,
 *     delay?: number
 * }} param
 */
export function showToastMessage(
    {
        toastType = '',
        title = '',
        content = '',
        delay = 7000
    } = {}){
    renderToastMessageWrapper();
    renderToastMessage(toastType, title, content, delay);
}

function renderToastMessage(toastType, title, content, delay){
    const toastMessage = createToastMessage(toastType, title, content, delay);
    attachToastButtons(toastMessage);
    appendToastMessageToWrapper(toastMessage)

    setTimeout( () =>{
        removeToastMessage(toastMessage);
    }, delay);
}

// 토스트 메시지 생성
function createToastMessage(toastType, title, content, delay){
    const toastMessage = document.createElement('div');
    toastMessage.classList.add('toast-message');
    toastMessage.style.setProperty('--timer-duration', `${delay}ms`)
    toastType && toastMessage.classList.add(toastType);

    const textBox = document.createElement('div');
    textBox.classList.add('text-box');
    toastMessage.appendChild(textBox); // 토스트 <- 텍스트 box 추가

    const toastTitle = document.createElement('p');
    toastTitle.classList.add('title');
    toastTitle.innerText = title;
    textBox.appendChild(toastTitle); // 텍스트 box <- 제목 추가

    const message = document.createElement('p');
    message.classList.add('content');
    message.innerText = content;
    textBox.appendChild(message); // 텍스트 box <- 메시지 추가

    const timerBar = document.createElement('div');
    timerBar.classList.add('timer-bar');
    toastMessage.appendChild(timerBar); // 토스트 <- 타이머 추가

    return toastMessage;
}

// 버튼 그룹 랜더
function attachToastButtons(toastMessage){
    const buttonBox = document.createElement('div');
    buttonBox.classList.add('btn-group');
    toastMessage.appendChild(buttonBox); // 토스트 <- 버튼 그룹 추가

    const buttonConfirm = document.createElement('button');
    buttonConfirm.classList.add('btn-confirm');
    buttonConfirm.innerText = '확인';
    buttonConfirm.addEventListener('click', () => {
        removeToastMessage(toastMessage);
    });
    buttonBox.appendChild(buttonConfirm); // 버튼 그룹 <- 버튼 추가


    const buttonExpand = document.createElement('button');
    buttonExpand.classList.add('btn-expand');
    buttonExpand.addEventListener('click', () => {
        toastMessage.classList.toggle('expand');
    });
    buttonBox.appendChild(buttonExpand); // 버튼 그룹 <- 버튼 추가
}

function appendToastMessageToWrapper(toastMessage){
    const toastMessageWrapper = document.querySelector('#toast-message-wrapper');

    toastMessageWrapper.appendChild(toastMessage);

    if(toastMessageWrapper.children.length > MAX_TOAST_MESSAGE_COUNT){
        removeToastMessage(toastMessageWrapper.children[0]);
    }
}
function renderToastMessageWrapper(){
    const isToastMessageWrapperExist = document.querySelector('#toast-message-wrapper');

    if(isToastMessageWrapperExist){ return; }

    const toastMessageWrapper = document.createElement('div');
    toastMessageWrapper.id = 'toast-message-wrapper';
    toastMessageWrapper.classList.add('toast-message-wrapper');

    document.body.appendChild(toastMessageWrapper);
}

function removeToastMessage(toastMessage){ // 토스트 메시지 제거
    toastMessage.classList.add('remove');
    setTimeout(() => {
        toastMessage.remove();
    },250);
}