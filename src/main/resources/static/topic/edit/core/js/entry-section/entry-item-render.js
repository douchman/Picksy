import {generateRandomEntryId} from "../../entry-uuid.js";

export function renderEntryItem(thumbnail, entryId = generateRandomEntryId()){
    const entryForm = document.querySelector('#entry-form');
    const entryItem =
        `<div class="entry-item" id="${entryId}">
            <input class="entry-thumb-upload" type="file" accept="image/*, video/*">
            <div class="entry-thumb ${!thumbnail && `empty`}" ${thumbnail ? `style="background-image : url(${thumbnail})"` : ''}></div>
                <div class="entry-desc">
                    <div class="entry-desc-input-group">
                        <span class="input-index">엔트리 명</span>
                        <input class="entry-name" type="text" maxlength="30">
                    </div>
                    <div class="entry-desc-input-group">
                         <span class="input-index">엔트리 설명</span>
                         <input class="entry-description" type="text" maxlength="200">
                    </div>
                    <div class="entry-desc-input-group">
                         <span class="input-index">유튜브 링크</span>
                         <input class="youtube-link" type="text" maxlength="200" placeholder="유튜브 링크를 입력해주세요">
                    </div>
                </div>
                <button class="btn-remove-entry"></button>
        </div>`;

    entryForm.insertAdjacentHTML('beforeend', entryItem);
}

// 생성되어있는 엔트리 랜더링 ( for modify )
export function renderExistEntryItem(thumbnail, entryId = generateRandomEntryId(), entryName, entryDesc, youTubeLink){
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
                <button class="btn-remove-entry"></button>
        </div>`;

    entryForm.insertAdjacentHTML('beforeend', entryItem);
}