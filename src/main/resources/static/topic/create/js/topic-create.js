import {addTopicCreateEvents} from "./l-topic-create.js";
import {addEntryCreateEvents} from "./r-entry-create.js";

document.addEventListener('DOMContentLoaded', () => {
    addTopicCreateEvents();
    addEntryCreateEvents();
});
