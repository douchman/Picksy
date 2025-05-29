window.addEventListener('DOMContentLoaded', () => {
    setupNotFound();
});

function setupNotFound(){
    addButtonEvent();
}

function addButtonEvent(){
    document.querySelector('#btn-back-to-main').addEventListener('click', () =>{
        location.href = '/';
    });
}