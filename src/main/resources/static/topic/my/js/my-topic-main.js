import {setupTopicCards} from "./topic-cards/topic-cards.js";
import {setupSearchFilter} from "./search-filter/topic-search-filter.js";

document.addEventListener("DOMContentLoaded", () => {
    setupTopicCards();
    setupSearchFilter();
})