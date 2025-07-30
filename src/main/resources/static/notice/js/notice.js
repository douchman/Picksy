import {setupNoticeCardsObserver} from "./notice-scroll-observer.js";
import {setupNoticeCards} from "./notice-cards.js";
import {setupNoticeFilter} from "./notice-filter.js";

document.addEventListener("DOMContentLoaded", () => {
    setupNoticeFilter();
    setupNoticeCards();
    setupNoticeCardsObserver();
});

