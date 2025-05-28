/**
 * 메인 레이아웃 스크롤 제어
 * @param {boolean} isBlock
 */
export function toggleBodyScrollBlocked(isBlock = false){
    const body = document.querySelector('body');

    isBlock ?
        body.classList.add('scroll-block')
        : body.classList.remove('scroll-block');
}