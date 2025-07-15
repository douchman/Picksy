document.addEventListener("DOMContentLoaded", () => {
    addIndexPageEvent();
});

function addIndexPageEvent(){
    document.querySelector('#click-to-action').addEventListener('click', () => {
        location.href = '/';
    })
}