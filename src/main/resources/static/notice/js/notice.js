import {setupNoticeCardsObserver} from "./notice-scroll-observer.js";
import {setupNoticeCards} from "./notice-cards.js";

document.addEventListener("DOMContentLoaded", () => {
    setupNoticeCards();
    setupNoticeCardsObserver();
});

