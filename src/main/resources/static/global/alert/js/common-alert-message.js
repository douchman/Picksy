export function renderCommonAlertMessage(title, message, btnFunction = null){
    const alertMessage =
        `<div class="common-alert-message">
            <div class="bg"></div>
            <div class="message-body">
                <p class="message-title">${title}</p>
                <p class="message-content"> ${message}</p>
            <div class="btn-group">
                <button class="btn-close-alert-message"></button>
            </div>
            </div>
        </div>`;

    document.querySelector('body').insertAdjacentHTML('beforeend', alertMessage);

    document.querySelector('.btn-close-alert-message').addEventListener('click', () =>{

        if( typeof btnFunction === 'function'){
            btnFunction();
        } else {
            document.querySelector('.common-alert-message').remove(); // common message remove
        }


    });
}