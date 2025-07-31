export function showToastMessage(message, toastType = '', delay = 2000){
    renderToastMessageWrapper();
    renderToastMessage(message, toastType, delay);
}

function renderToastMessage(message, toastType, delay){
    if( message && message !== ''){
        removeToastMessage();
        const commonToast = document.createElement('div');
        commonToast.classList.add('common-toast');
        toastType && commonToast.classList.add(toastType);

        commonToast.innerHTML =
            `<p class="toast-message">${message}</p>`;

        document.body.appendChild(commonToast);

        setTimeout( () =>{
            commonToast.remove();
        }, delay);
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

function removeToastMessage(){
    document.querySelectorAll('.common-toast').forEach(toast => toast.remove());
}