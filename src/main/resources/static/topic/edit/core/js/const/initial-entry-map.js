export const initialEntryDataMap = new Map();

export function appendToInitialEntryDataMap(entry){
    const entryName = entry.entryName;
    const description = entry.description;
    const isMediaChanged = false;

    initialEntryDataMap.set(entry.id ,{
            entryName,
            description,
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