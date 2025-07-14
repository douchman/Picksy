import {generateRandomEntryId} from "../../entry-uuid.js";
import {MediaType} from "../../../../../global/const/const.js";

// 엔트리 등록 영역 세로 스크롤 설정
export function setupEntryGroupVerticalScroll(){
    const entrySection = document.querySelector('#entry-section'); // 엔트리 편집 영역 ( 최상위 부모 )
    const sectionHeader = entrySection.querySelector('.section-header'); // 영역 헤더 인덱스
    const entryAddZone = entrySection.querySelector('#entry-add-zone'); // 엔트리 슬롯 추가 영역
    const entryGroup = entrySection.querySelector('.entry-group'); // 엔트리 슬롯 영역 ( 스크롤 부여 대상 )

    const getTotalHeight = (el) => {
        const styles = window.getComputedStyle(el);
        const marginTop = parseFloat(styles.marginTop);
        const marginBottom = parseFloat(styles.marginBottom);
        return el.offsetHeight + marginTop + marginBottom;
    }

    const entrySectionHeight = getTotalHeight(entrySection);
    const sectionHeaderHeight = getTotalHeight(sectionHeader);
    const entryAddZoneHeight = getTotalHeight(entryAddZone);

    const entrySectionPadding = parseFloat(window.getComputedStyle(entrySection).paddingTop) + parseFloat(window.getComputedStyle(entrySection).paddingBottom);

    // 엔트리 영역 높이 - ( 영역 헤더 높이 + 엔트리 추가 영역 높이 + 영역 상단/하단 여백 )
    const entryGroupHeight = entrySectionHeight - (sectionHeaderHeight + entryAddZoneHeight + entrySectionPadding);

    entryGroup.style.maxHeight = entryGroupHeight + 'px';
    entryGroup.style.overflowY = 'auto';
}

export function renderEntryItem(thumbnail, entryId = generateRandomEntryId(), name = '', description = '') {
    const entryForm = document.querySelector('#entry-form');
    const entryItem =
        `<div class="entry-item" id="${entryId}">
            <input class="entry-thumb-upload" type="file" accept="image/*, video/*">
            <div class="entry-thumb ${!thumbnail && `empty`}" ${thumbnail ? `style="background-image : url(${thumbnail})"` : ''}></div>
                <div class="entry-desc">
                    <div class="entry-desc-input-group">
                        <span class="input-index">엔트리 명</span>
                        <input class="entry-name" type="text" maxlength="30" value="${name}">
                    </div>
                    <div class="entry-desc-input-group">
                         <span class="input-index">엔트리 설명</span>
                         <input class="entry-description" type="text" maxlength="200" value="${description}">
                    </div>
                    <div class="entry-desc-input-group">
                         <span class="input-index">유튜브 링크</span>
                         <input class="youtube-link" type="text" maxlength="200" placeholder="유튜브 링크를 입력해주세요">
                    </div>
                </div>
                <div class="item-tools">
                    <button class="btn-remove-entry only"></button>
                </div>
        </div>`;

    entryForm.insertAdjacentHTML('beforeend', entryItem);
}

// 생성되어있는 엔트리 랜더링 ( for modify )
export function renderModifyEntryItem(thumbnail, entryId = generateRandomEntryId(), entryName, entryDesc, youTubeLink){
    const entryForm = document.querySelector('#entry-form');
    const entryItem =
        `<div class="entry-item modify-entry" id="${entryId}">
            <input class="entry-thumb-upload" type="file" accept="image/*, video/*">
            <div class="entry-thumb" style="background-image : url(${thumbnail})"></div>
                <div class="entry-desc">
                    <div class="entry-desc-input-group">
                        <span class="input-index">엔트리 명</span>
                        <input class="entry-name" value="${entryName}" type="text" maxlength="30">
                    </div>
                    <div class="entry-desc-input-group">
                         <span class="input-index">엔트리 설명</span>
                         <input class="entry-description" value="${entryDesc}" type="text" maxlength="200">
                    </div>
                    <div class="entry-desc-input-group">
                         <span class="input-index">유튜브 링크</span>
                         <input class="youtube-link" value="${youTubeLink ? youTubeLink : ''}" type="text" maxlength="200" placeholder="유튜브 링크를 입력해주세요">
                    </div>
                </div>
                <div class="item-tools">
                    <button class="btn-remove-entry"></button>
                    <button class="btn-restore-entry"></button>
                </div>
                <div class="mask-removed"></div>
        </div>`;

    entryForm.insertAdjacentHTML('beforeend', entryItem);
}


// 기존 엔트리 랜더링
export function renderExistingEntries(existEntries){
    existEntries.forEach(entry => {
        const entryMediaType = entry.mediaType;
        const entryMediaUrl = entry.mediaUrl;
        const entryThumbnail =
            entryMediaType === MediaType.IMAGE ?
                entry.mediaUrl
                : entry.thumbnail;

        renderModifyEntryItem(
            entryThumbnail,
            entry.id,
            entry.entryName,
            entry.description,
            `${entryMediaType === MediaType.YOUTUBE ? entryMediaUrl : ''}`);
    });
}