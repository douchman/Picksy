export function showToastMessage(message, toastType = '', delay = 2000){
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

function removeToastMessage(){
    document.querySelectorAll('.common-toast').forEach(toast => toast.remove());
}