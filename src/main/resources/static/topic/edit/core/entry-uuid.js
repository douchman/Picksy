import {generateRandomId} from "../../../global/util/random-id-generator.js";

export function generateRandomEntryId() {
    return `entry-${generateRandomId()}`;
}