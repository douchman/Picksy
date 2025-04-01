import {addEntrySlotClickEvents} from "./entry-event-handle.js";

/* 각 대결 엔트리 랜더링 */
export function renderEntriesAndAddEvents(entryMatch){
    clearMatchStage();
    const entryTargetA = createEntrySlot('entry-a', 'entry-slot');
    const entryTargetB = createEntrySlot('entry-b', 'entry-slot');

    const entryA = entryMatch.entryA;
    const entryB = entryMatch.entryB;

    // ID 설정
    entryTargetA.dataset.id = entryA.id;
    entryTargetB.dataset.id = entryB.id;

    // 엔트리 미디어 타입에 따라 썸네일 랜더링
    determineRenderingHandler(entryTargetA, entryA);
    determineRenderingHandler(entryTargetB, entryB);

    // 각 엔트리 별 이벤트 등록
    addEntrySlotClickEvents(entryTargetA);
    addEntrySlotClickEvents(entryTargetB);
}

function createEntrySlot(id, ...classNames){
    const entrySlot = document.createElement('div');
    entrySlot.id = id;
    entrySlot.classList.add(...classNames);
    return entrySlot;
}

/* 엔트리 미디어 타입 별 핸들러 분기 */
function determineRenderingHandler(renderTarget, entry){
    const mediaType = entry.mediaType;

    switch(mediaType) {
        case 'IMAGE' :
            handleImageTypeEntry(renderTarget, entry);
            break;
        case 'VIDEO' :
            handleVideoTypeEntry(renderTarget, entry);
            break;
        case 'YOUTUBE':
            handleYoutubeTypeEntry(renderTarget, entry);
            break;
    }
}

// 이미지 유형 엔트리 랜더 핸들링
function handleImageTypeEntry(renderTarget, entry){
    renderEntryName(renderTarget, entry.entryName);
    renderSelectEntryButton(renderTarget);
    const entryImage = document.createElement('div')
    entryImage.classList.add('entry-image');
    entryImage.style.backgroundImage = `url(${entry.mediaUrl})`;

    renderTarget.appendChild(entryImage);
    document.querySelector('#match-stage').appendChild(renderTarget);
}

// 비디오 유형 엔트리 랜더 핸들링
function handleVideoTypeEntry(renderTarget, entry){
    renderEntryName(renderTarget, entry.entryName);
    renderSelectEntryButton(renderTarget);
    const videoBackground =
        `<video class="video-background" autoplay muted loop playsinline>
            <source src="${entry.mediaUrl}" type="video/mp4">
        </video>`;
    renderTarget.insertAdjacentHTML('beforeend', videoBackground);
    document.querySelector('#match-stage').appendChild(renderTarget);
}

// 유튜브 유형 엔트리 랜더 핸들링
function handleYoutubeTypeEntry(renderTarget, entry){
    renderEntryName(renderTarget, entry.entryName);
    renderSelectEntryButton(renderTarget);
    const youtubeVideo = document.createElement('div');
    youtubeVideo.classList.add('you-tube-video');
    renderTarget.appendChild(youtubeVideo);

    document.querySelector('#match-stage').appendChild(renderTarget);

    const videoId = extractYoutubeVideoIdFromUrl(entry.mediaUrl);

    if (renderTarget._ytPlayer) {
        renderTarget._ytPlayer.destroy();
    }

    renderTarget._ytPlayer = new YT.Player(youtubeVideo, {
        width: '100%',
        height: '70%',
        videoId: videoId,
        playerVars: {
            'playsinline': 1
        },
    });
}

function renderEntryName(renderTarget, entryName) {
    renderTarget.insertAdjacentHTML('beforeend', `<p class="entry-name">${entryName}</p>`)
}

function renderSelectEntryButton(renderTarget){
    const selectButton = `<button class="btn-select-entry" type="button"></button>`;
    renderTarget.insertAdjacentHTML('beforeend', selectButton);
}

function extractYoutubeVideoIdFromUrl(url) {
    const regExp = /(?:youtube\.com\/.*[?&]v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
}


// 매치 스테이지 내 랜더링 요소 초기화
function clearMatchStage(){
    const matchStage = document.querySelector('#match-stage');
    matchStage.innerHTML = '';
}
