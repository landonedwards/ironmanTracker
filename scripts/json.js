
function isolateDate(dateString) {
    // format is "2025-10-12T04:38..".
    // splits it into two strings and takes the part before the "T"
    return dateString.split("T")[0];
}

export function createSaveJSON(playthroughData)
{
    const jsonString = JSON.stringify(playthroughData, null, 2);

    const blob = new Blob([jsonString], { type: "application/json"});
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    // link format: sacredMainCampaign2025-10-12Save.json
    link.download = `${playthroughData.gameId}${playthroughData.campaignName}${isolateDate(playthroughData.startDate)}Save.json`;
    link.click();

    URL.revokeObjectURL(url);
}