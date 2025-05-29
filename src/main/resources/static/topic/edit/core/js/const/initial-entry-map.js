export const initialEntryDataMap = new Map();

export function appendToInitialEntryDataMap(entry){
    const entryName = entry.entryName;
    const description = entry.description;
    const mediaType = entry.mediaType;
    const mediaUrl = entry.mediaUrl;
    const thumbnail = entry.thumbnail;
    const isMediaChanged = false;

    initialEntryDataMap.set(entry.id ,{
            entryName,
            description,
            mediaType,
            mediaUrl,
            thumbnail,
            isMediaChanged
        });
}

export function isModifiedEntry(entryId, currentData){
    const initialEntryData = initialEntryDataMap.get(Number(entryId));

    if( !initialEntryData) return true;

    return (currentData.entryName !== initialEntryData.entryName ||
        currentData.description !== initialEntryData.description ||
        initialEntryData.isMediaChanged);
}