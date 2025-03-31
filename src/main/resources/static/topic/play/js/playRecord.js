import {apiGetRequest} from "../../../global/js/api.js";
import {playRecord} from "./const.js";
import {showToastMessage} from "../../../global/popup/js/common-toast-message.js";

export async function loadEntryMatchInfo() {
    const {status, data: matchInfo} = await getMatch();

    if (status === 200) {
        const currentTournament = matchInfo.currentTournament;
        const entryMatch = matchInfo.entryMatch;

        renderCurrentTournament(currentTournament);
        renderEntriesFromEntryMatch(entryMatch);

    } else {
        handleEntryMatchInfoException(matchInfo);
    }
}

/* 각 대결 엔트리 랜더링 */
function renderEntriesFromEntryMatch(entryMatch){
    const entryTargetA = createEntrySlot('entry-a', 'entry-slot');
    const entryTargetB = createEntrySlot('entry-b', 'entry-slot');

    const entryA = entryMatch.entryA;
    const entryB = entryMatch.entryB;

    determineRenderingHandler(entryTargetA, entryA);
    determineRenderingHandler(entryTargetB, entryB);
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
    const entryImage = document.createElement('div')
    entryImage.classList.add('entry-image');
    entryImage.style.backgroundImage = `url(${entry.mediaUrl})`;

    renderTarget.appendChild(entryImage);
    document.querySelector('#match-stage').appendChild(renderTarget);
}

// 비디오 유형 엔트리 랜더 핸들링
function handleVideoTypeEntry(renderTarget, entry){
    renderEntryName(renderTarget, entry.entryName);
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
    const youtubeVideo = document.createElement('div');
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

function extractYoutubeVideoIdFromUrl(url) {
    const regExp = /(?:youtube\.com\/.*[?&]v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
}

function renderCurrentTournament(currentTournament){
    document.querySelector('#current-tournament').textContent = `<${currentTournament}>`;
}

async function getMatch(){
    return await apiGetRequest(`topics/play-records/${playRecord.getId()}/matches`);
}

function handleEntryMatchInfoException(matchInfo){
    const errorCode = matchInfo.errorCode;
    const message = matchInfo.message;

    showToastMessage(`${message}`, 'alert', 3000);
    setTimeout(() => {
        location.href = '/';
    }, 2000);
}