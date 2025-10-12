// variable declarations 
let characters;
// for blazing blade
let gameModes;
// for sacred stones and binding blade
let gameDetails;
let currentPlaythrough = null;
// const newPlaythrough = {
//         id: generateUniqueId(),
//         startDate: new Date(),
//         gameId: gameId,
//         selectedDifficulty: selectedDifficulty,
//         campaignName: gameMode ? gameMode.name : gameDetails.name,
//         mainLord : gameMode ? gameMode.mainLord : gameDetails.mainLord,
//         data: {
//             characters: [],
//             currentChapter: null,
//             deathCount: 0
//         }
//     }

//     if (gameMode != null) {
//         newPlaythrough.gameMode = gameMode;
//     }
let currentChapter;
let deathCount = 0;
let currentModalCharElement;


// key for storing dead characters in localStorage
const PLAYTHROUGHS_KEY = "fireEmblemIronmanSaves";
const CURRENT_PLAYTHROUGH_KEY = "currentIronmanSave";

const charContainer = document.querySelector(".characterContainer");
const chapSelect = document.querySelector("#chapSelect");
const prevButton = document.querySelector("#prevButton");
const nextButton = document.querySelector("#nextButton");

const graveyardContainer = document.querySelector(".graveyardContainer");

const chapterSummaryContainer = document.querySelector(".chapterSummaryContainer");

const playButton = document.querySelector(".playButton");
const loadButton = document.querySelector(".loadButton");
const resetButton = document.querySelector(".resetGameButton");
const gameShelf = document.querySelector(".shelfContainerContainer");

const mainNav = document.querySelector(".mainNav");
const body = document.querySelector("body");
let main = document.querySelector("main");
const footer = document.querySelector("footer");


async function fetchGameData(filename) {
    try {
        // await fetch call to get the response object
        const response = await fetch(filename);

        // check if response was successful
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // await the parsing of the JSON object from the response
        const gameData = await response.json();
        return gameData;
    }

    catch (error) {
        console.error("Error fetching game data:", error);
        return null;
    }
}

function loadGameDataFromStorage() {
    // check if there's a characters property in the loaded game data
    if (currentPlaythrough.data.characters) {        
        // load character state
        currentPlaythrough.data.characters.forEach(loadedChar => {
            // find the corresponding character in the global characters array
            const existingChar = characters.find(c => c.id == loadedChar.id);
            if (existingChar) {
                // update the character's status, death chapter, and death note
                existingChar.status = loadedChar.status;
                existingChar.deathChapter = loadedChar.deathChapter;
                existingChar.deathNote = loadedChar.deathNote;
            }
        });

        // check if the current chapter property exists in loaded data
        if (currentPlaythrough.data.currentChapter != null) {
            // update global chapter variable
            currentChapter = currentPlaythrough.data.currentChapter;
        }

        deathCount = currentPlaythrough.data.deathCount;
    }
}

function saveGameDataToStorage() {
    const existingPlaythroughs = JSON.parse(localStorage.getItem(PLAYTHROUGHS_KEY)) || [];
    const currentPlaythroughIndex = existingPlaythroughs.findIndex(p => p.id == currentPlaythrough.id);
    if (currentPlaythroughIndex != -1) {
        existingPlaythroughs[currentPlaythroughIndex].data.characters = characters;
        existingPlaythroughs[currentPlaythroughIndex].data.currentChapter = currentChapter;
        existingPlaythroughs[currentPlaythroughIndex].data.deathCount = deathCount;

        existingPlaythroughs[currentPlaythroughIndex].mainLord = currentPlaythrough.mainLord;
        existingPlaythroughs[currentPlaythroughIndex].selectedRoute = currentPlaythrough.selectedRoute;
    }
    else {
        console.error("Current playthrough data could not be found. Cannot be saved.")
        return;
    }

    // saves global characters array and current chapter in string format to localStorage
    localStorage.setItem(PLAYTHROUGHS_KEY, JSON.stringify(existingPlaythroughs));
}

// for use in populateChapterDropdown() to convert nonnumeric chapter values
function getNumericChapterValue(stringChapter) {
    let xCount = 0;
    // grab integer from chapter value 
    let initialValue = parseInt(stringChapter);

    // for each letter in chapter value
    for (let i = 1; i < stringChapter.length; i++) {
        if (stringChapter[i] == "x") {
            xCount ++;
        } 
    }

    // if chapter is a gaiden chapter (ex: 5x)...
    if (xCount == 1) {
        // add to its numeric value
        initialValue += 0.5
    }
    else if (xCount > 1) {
        // if chapter is a gaiden chapter following a gaiden, add an increased value to it (for comparison purposes)
        initialValue += 0.75
    }

    return parseFloat(initialValue);
}

function parseRouteRecruitmentChapter(stringChapters, selectedRoute = null) {
    // if it's already a number, return it
    if (typeof stringChapters == "number") {
        return stringChapters;
    }
    
    // if it doesn't contain a slash, it's just a chapter string
    if (!stringChapters.includes("/")) {
        return getNumericChapterValue(stringChapters);
    }

    // creates array of [eirika join chapter, ephraim join chapter]
    // also trims whitespace (currently formatted as "10 / 12")
    const routeRecruitmentChapters = stringChapters.split("/").map(ch => ch.trim());

    if (selectedRoute == "ephraim") {
        return getNumericChapterValue(routeRecruitmentChapters[1]);
    }
    // if it's not ephraim's route, default to eirika's
    else {
        return getNumericChapterValue(routeRecruitmentChapters[0]);
    }
}

function populateChapterDropdown(gameMode, preserveCurrentChapter = false) {
    // clear dropdown options so they don't stack and initialize base value 
    chapSelect.innerHTML = `<option value="">All</option>`;
    // populate chapter dropdown based on what mode you're playing
    gameMode.chapters.forEach(chapter => {
        // skips chapters with a type (route split)
        if (!chapter.type) {
            const chapterNum = document.createElement("option");
            chapterNum.value = chapter.number;
            chapterNum.textContent = `Chapter ${chapter.number}: ${chapter.name}`;
            chapSelect.append(chapterNum);
        }
    })

    // if preserveCurrentChapter is null or left out, default chapSelect to the first index and value
    if (!preserveCurrentChapter) {
        chapSelect.selectedIndex = 1;
        currentChapter = chapSelect.value;
    }
}

function chapterTemplate(chapterNumber, chapterName) {
    return `
    <option value="${chapterNumber}">Chapter ${chapterNumber} : ${chapterName}</option>
    `;
}

function addChosenRouteChapters(routeName) {
    const routeSplitChapters = gameDetails.chapters.find(chapter => chapter.type == "route-split");
    const chapterBeforeSplit = routeSplitChapters.chapterBeforeSplit;
    const chaptersToAdd = routeSplitChapters.routes[routeName];

    const chapterBeforeSplitElement = chapSelect.querySelector(`option[value="${chapterBeforeSplit}"]`);
    let chaptersHTML = "";

    chaptersToAdd.forEach(chapter => {
        chaptersHTML += chapterTemplate(chapter.number, chapter.name);
    })

    chapterBeforeSplitElement.insertAdjacentHTML("afterend", chaptersHTML);
}

// filter helper function
function filterJoinChapter(character) {
    // convert all chapter values (gaiden chapters are initially strings) to numbers for comparison between join chapter and selected chapter
    const selectedChapter = getNumericChapterValue(chapSelect.value);
    const characterJoinChapter = parseRouteRecruitmentChapter(character.joinChapter, currentPlaythrough.selectedRoute);

    return characterJoinChapter <= selectedChapter;
}

function filterCharactersByChapter() {
    const selectedChapter = chapSelect.value;
    // if no specific chapter is selected, display characters for all chapters.
    if (selectedChapter == "") {
        return characters;
    }
    // get and return filtered characters
    const filteredChars = characters.filter(filterJoinChapter);
    return filteredChars;
}

function updateChapter(direction) {
    // grab current chapter selection
    let currentChapterIndex = chapSelect.selectedIndex;
    let newChapterIndex;
    
    if (direction == "next") {
        newChapterIndex = currentChapterIndex + 1;
        // if on the last chapter, keep current selection
        if (newChapterIndex >= chapSelect.options.length) {
            newChapterIndex = currentChapterIndex;
        }
    }

    if (direction == "prev") {
        newChapterIndex = currentChapterIndex - 1;
        // if on the first chapter, keep current selection
        if (newChapterIndex < 0) {
            newChapterIndex = currentChapterIndex;
        }
    }

    // update current chapter selection based on whether it was the 'next' or 'prev' button
    chapSelect.selectedIndex = newChapterIndex;

    // triggers change event so all logic runs
    // SHOULD ADD chapSelect.dispatchEvent(new Event("change"));

    // updates the stored chapter value with the one at the new index
    currentChapter = chapSelect.options[newChapterIndex].value;
}

function displayCharacters(characters, containerElement) {
    // clear container to prevent stacking
    containerElement.innerHTML = "";

    characters.forEach(char => {
        // container to add spacing between each display
        const displayContainer = document.createElement("div");
        displayContainer.classList.add("displayContainer");

        const unitDisplay = document.createElement("div");
        // check if page is graveyard or tracker and add respective class for styling
        if (containerElement == graveyardContainer) {
            unitDisplay.classList.add("graveDisplay");
        }
        else {
            unitDisplay.classList.add("charDisplay");
            addGameIdClass(unitDisplay, currentPlaythrough.gameId);
        }
        // assign the id of the character object to a custom attribute on the div for future reference
        unitDisplay.dataset.charId = char.id;

        // check character status and add 'dead' class if needed
        if (char.status == "deceased") {
            unitDisplay.classList.add("dead");
        }

        const portrait = document.createElement("img");
        portrait.src = char.image;
        portrait.alt = char.charName;

        const bigX = document.createElement("img");
        bigX.src = "images/misc/redX.png";
        bigX.alt = "Big red X";
        bigX.classList.add("redXIcon");

        const name = document.createElement("p");
        name.textContent = char.charName;

        unitDisplay.append(portrait, bigX, name);
        displayContainer.append(unitDisplay);
        containerElement.append(displayContainer);
});
}

function generateSacredStonesRouteSplitModal() {
    return `
    <div class="sacredStonesRouteSplitModal">
      <div class="sacredStonesRouteSplitModalContent">
        <p>What route did you choose?</p>
        <div class="routeButtonsContainer">
          <button class="ephraimRoute">
            <img src="images/routes/ephraimRoute.png" alt="Ephraim Route">
            <h4>Ephraim</h4>
          </button>
          <button class="eirikaRoute">
            <img src="images/routes/eirikaRoute.png" alt="Eirika Route">
            <h4>Eirika</h4>
          </button>
        </div>
      </div>
    </div>
    `;
}

function sacredStonesRouteSplitModalHandler() {
    const sacredStonesRouteSplitModal = document.querySelector(".sacredStonesRouteSplitModal");
    const ephraimRouteButton = document.querySelector(".ephraimRoute");
    const eirikaRouteButton = document.querySelector(".eirikaRoute");

    function handleRouteSelection(routeName) {
        addChosenRouteChapters(routeName);
        currentPlaythrough.mainLord = routeName;
        currentPlaythrough.selectedRoute = routeName;

        renderLiveReaction(currentPlaythrough.mainLord);
        saveGameDataToStorage();
        
        ephraimRouteButton.removeEventListener("click", handleRouteSelection);
        eirikaRouteButton.removeEventListener("click", handleRouteSelection);
        sacredStonesRouteSplitModal.remove();
    }

    ephraimRouteButton.addEventListener("click", () => handleRouteSelection("ephraim"));
    eirikaRouteButton.addEventListener("click", () => handleRouteSelection("eirika"));
}

function generateDeathConfirmationModal(character, chapter) {
    // creates the html for a modal to confirm if the character died
    return `
      <div class="deathModal">
        <div class="modalContent">
          <div class="closeButtonContainer">
            <button class="closeButton">X</button>
          </div>

          <div class="modalDetailsContainer">
            <div class="modalDetails">
              <p><span class="deathModalSpecialText chapterText">Chapter ${chapter}</span></p>
              <div class="characterModalInfo">
                <div class="portraitContainer">
                  <img src="${character.image}">
                </div>
                <p>Did <span class="deathModalSpecialText">${character.charName}</span> fall in battle?</p>
              </div>
            </div>

            <div class="deathConfirmationContainer">
              <button id="yesButton">Yes</button>
              <button id="noButton">No</button>
            </div>
          </div>

          <div class="deathNoteSection hidden"> 
            <p>How did <span class="deathModalSpecialText">${character.charName}</span> meet their end? (Optional)</p>
            <textarea id="deathNoteInput" rows="6" placeholder="Crit by a sniper ambush spawn..."></textarea>
            <div class="noteOptionsContainer">
              <button id="saveNoteButton">Save</button>
              <button id="cancelNoteButton">Cancel</button>
            </div>
          </div>

        </div>
      </div>
    `;
}

function modalHandler(characterDisplayElement) {
    // grab unique attribute on character display
    const charDisplayId = characterDisplayElement.dataset.charId;
    let characterForModal;

    // grab the first character object that has the ID
    characterForModal = characters.find(c => c.id == charDisplayId);

    // if no character object is found, prevent the modal from opening.
    if (!characterForModal) {
        console.error("Character not found for modal.")
        return;
    }

    // display the modal
    document.body.insertAdjacentHTML("beforeend", generateDeathConfirmationModal(characterForModal, currentChapter));

    const yesButton = document.querySelector("#yesButton");
    const noButton = document.querySelector("#noButton");
    const closeButton = document.querySelector(".closeButton");

    // if yes is clicked, move on to prompting for death note
    yesButton.addEventListener("click", () => {
        promptForDeathNote(characterForModal, characterDisplayElement);
    });
    // otherwise, close the modal
    noButton.addEventListener("click", closeDeathModal);
    closeButton.addEventListener("click", closeDeathModal);
}

function promptForDeathNote(character, characterDisplayElement) {
    // grab and remove the death confirmation text
    const modalDetails = document.querySelector(".modalDetailsContainer");
    modalDetails.remove();

    const deathNoteSection = document.querySelector(".deathNoteSection");
    // show the death note prompt and input box
    deathNoteSection.classList.remove("hidden");

    const deathNoteInputBox = document.querySelector("#deathNoteInput");
    const saveButton = document.querySelector("#saveNoteButton");
    const cancelButton = document.querySelector("#cancelNoteButton");

    saveButton.addEventListener("click", () => {
        // grab death note provided by the user
        let deathNote = deathNoteInputBox.value.trim();
        // if user leaves it blank, provide a generic death description
        if (deathNote == "") {
            deathNote = "Died fighting for a better future.";
            saveDeathNote(character, deathNote, characterDisplayElement);
        }
        else {
            saveDeathNote(character, deathNote, characterDisplayElement);
        }
    });

    cancelButton.addEventListener("click", closeDeathModal);
}

function closeDeathModal() {
    const deathModal = document.querySelector(".deathModal");
    deathModal.remove();
}

function saveDeathNote(character, deathNote, characterDisplayElement) {
    // update character's status, death chapter, and death note in characters array
    character.status = "deceased";
    character.deathChapter = currentChapter;
    character.deathNote = deathNote;

    deathCount ++;
    saveGameDataToStorage();
    // update character display to show dead class styling
    characterDisplayElement.classList.add("dead");
    closeDeathModal();
}

function gameOverModalHTML() {
    return `
    <div class="gameOverModal">
      <div class="gameOverModalContent">
        <img src="images/misc/fe7-game-over.png" alt="Game over screen">
      </div>
    </div>
    `
}

function resetConfirmationModalHTML() {
    return `
    <div class="resetConfirmModal">
      <div class="resetConfirmModalContent">
        <p>Are you sure you want to reset your save data? Doing so will delete all recorded deaths, their details, and completed chapters.</p>
        <div class="resetButtonsContainer">
          <button class="resetYesButton">Yes</button>
          <button class="resetNoButton">No</button>
        </div>
      </div>
    </div>
    `;
}

function resetModalHandler() {
    document.body.insertAdjacentHTML("beforeend", resetConfirmationModalHTML());

    const yesButton = document.querySelector(".resetYesButton");
    const noButton = document.querySelector(".resetNoButton");
    const resetConfirmationModal = document.querySelector(".resetConfirmModal");

    yesButton.addEventListener("click", () => {
        resetButton.classList.remove("selected");
        closeElement(resetConfirmationModal);
        resetGameData();
    })

    noButton.addEventListener("click", () => {
        closeElement(resetConfirmationModal);
        resetButton.classList.remove("selected");
    })
}

function resetGameData() {
    // reset each character's status back to initial values
    characters.forEach(char => {
        char.status = "alive";
        char.deathChapter = null;
        char.deathNote = null;
    });

    // reset global chapter variable
    currentChapter = chapSelect.options[1].value;
    // set initial chapter to the first chapter of chosen mode
    chapSelect.selectedIndex = 1;
    deathCount = 0;
    // save reset game data to local storage (character status and current chapter)
    saveGameDataToStorage();

    if (document.body.id == "tracker-page" && charContainer) {
        // clear character container
        charContainer.innerHTML = "";
        const filteredChars = filterCharactersByChapter();
        // reset character display 
        displayCharacters(filteredChars, charContainer);
    }
}

function closeElement(element) {
    if (element) {
        element.remove();
    }
}

function addGameIdClass(element, gameId) {
    element.classList.add(gameId);
}

function updatePageUI(gameId) {
    // may want to define these variables in this function and not at the top
    const elementsToUpdate = [
        charContainer, 
        body, 
        mainNav,
        footer
    ];

    elementsToUpdate.forEach(element => {
        if (element) {
            addGameIdClass(element, gameId);
        }
    })
}

const LORD_IMAGE_MAP = {
    "roy": {
        banner: "live-old-eliwood-banner.png",
        reaction: "old-eliwood.png"
    },
    "eliwood": {
        banner: "live-eliwood-banner.png",
        reaction: "eliwood.png"
    },
    "hector": {
        banner: "live-hector-banner.png",
        reaction: "hector.png"
    },
    "lyn": {
        banner: "live-lyn-banner.png",
        reaction: "lyn.png"
    },
    "ephraim": {
        banner: "live-ephraim-banner.png",
        reaction: "ephraim.png"
    },
    "eirika": {
        banner: "live-eirika-banner.png",
        reaction: "eirika.png"
    }
}

function renderLiveReaction(mainLord) {
    const reactionBanner = document.querySelector(".lordReactionImgBanner");
    const lordLiveReaction = document.querySelector(".lordLiveReaction");

    const BASE_PATH = "images/live-reaction/";
    const images = LORD_IMAGE_MAP[mainLord.toLowerCase()];

    if (!images) {
        console.error(`Error: Main lord ${mainLord} not found in LORD_IMAGE_MAP.`);
        return;
    }

    reactionBanner.src = BASE_PATH + images.banner;
    lordLiveReaction.src = BASE_PATH + images.reaction;
}

function renderLogo(gameId) {
    const logoContainer = document.querySelector(".logoContainer");
    if (!logoContainer) {
        console.log("No gameLogo container to insert into.")
        return;
    }

    const logoImg = document.createElement("img");
    logoImg.classList.add("gameLogo");

    switch (gameId) {
        case "blazing":
            logoImg.src = "images/logo/fe7-transparent-logo.png";
            break;
        case "binding":
            logoImg.src = "images/logo/fe6-transparent-logo.png";
            break;
        case "sacred":
            logoImg.src = "images/logo/fe8-transparent-logo.png";
            break;
        default:
            console.error("Unknown game ID:", gameId);
            return;
    }

    logoContainer.insertAdjacentElement("beforeend", logoImg);
}

async function initPage() {

    currentPlaythrough = getCurrentPlaythrough();
    if (currentPlaythrough) {
        const gameFile = getGameDataFile(currentPlaythrough.gameId);
        const fetchedData = await fetchGameData(gameFile);
        updatePageUI(currentPlaythrough.gameId);

        if (fetchedData) {
            // assign values to global variables based on fetched game data
            characters = fetchedData.characters;
            // check if game has different modes (blazing blade)
            if (fetchedData.gameModes) {
                gameModes = fetchedData.gameModes;

                // if user has not selected a mode...
                if (!currentPlaythrough.gameMode) {
                    // set default to Eliwood mode
                    currentPlaythrough.gameMode = gameModes.find(mode => mode.id == 2);

                    // if default doesn't exist, return and stop function
                    if (!currentPlaythrough.gameMode) {
                        console.error("Default game mode not found. Cannot initialize tracker.");
                        return;
                    }
                }

                const modeCharacters = currentPlaythrough.gameMode.charactersInMode.map(modeChar => {
                    const baseChar = characters.find(char => char.id == modeChar.charId);
                    if (baseChar) {
                        return {
                            // copy all properties from original character
                            ...baseChar,
                            // set the character's join chapter for this mode and merge it into one character array (specific to this mode)
                            joinChapter: modeChar.joinChapter
                        };
                    }
                    return null;
                }) // could add .filter(Boolean) to remove any nonvalid characters created 

            // assign new array with correct join chapter values to global characters array
            characters = modeCharacters;
            }

            // else, update global gameDetails variable
            else if (fetchedData.gameDetails) {
                gameDetails = fetchedData.gameDetails;
            }

            loadGameDataFromStorage();
            return true;
        }

        else {
            console.error("Failed to load game data. Page may not function correctly.");
            return false;
        }
    }

    // allows initialization even if there's no current playthrough (it's the game-select page)
    else if (document.body.id == "game-select-page") {
        return true;
    }

    else {
        console.error("No save data found. Page may not function correctly. Redirecting to game select page.");
        // redirect to game select page to allow user to choose their game and settings
        // window.location.assign("game-select.html");
    }
}

async function initTrackerPage() {
    const initialized = await initPage();
    if (initialized) {
        renderLogo(currentPlaythrough.gameId);
        renderLiveReaction(currentPlaythrough.mainLord);

        let chapters;
        if (currentPlaythrough.gameMode) {
            chapters = currentPlaythrough.gameMode;
        }
        else {
            chapters = gameDetails;
        }

        const hasLoadedChapter = currentChapter != null;
        populateChapterDropdown(chapters, hasLoadedChapter);

        if (currentPlaythrough.selectedRoute) {
            addChosenRouteChapters(currentPlaythrough.selectedRoute);
        }

        // ensures chapter display reflects current chapter
        if (hasLoadedChapter) {
            chapSelect.value = currentChapter;
        }
        
        let filteredChars = filterCharactersByChapter();
        displayCharacters(filteredChars, charContainer);
    }
}

// graveyard page exclusive functions

function generateDeathDetailsModal(character) {
    return `
    <div class="deathDetailsModal">
        <div class="modalContent">
            <div class="closeButtonContainer">
                <button class="closeButton">X</button>
            </div>
            <div class="modalDetailsContainer">
                <h3>${character.charName}'s Final Moments</h3>
                <img src="${character.image}" alt="${character.charName}" class="modal-portrait">
                <p>Fell in Chapter ${character.deathChapter}</p>
                <p class="deathNote">"<i>${character.deathNote}</i>"</p>
            </div>
        </div>
    </div>
    `;
}

function displayDeathDetailsModal(characterDisplayElement) {
    // grab unique attribute on character display
    const charId = characterDisplayElement.dataset.charId;
    let character;

    // grab the first character object that has the ID
    character = characters.find(c => c.id == charId);

    // if no character object is found, prevent the modal from opening.
    if (!character) {
        console.error("Character not found for modal.")
        return;
    }

    // display the modal
    document.body.insertAdjacentHTML("beforeend", generateDeathDetailsModal(character));

    const modal = document.querySelector(".deathDetailsModal");
    const closeButton = modal.querySelector(".closeButton");

    closeButton.addEventListener("click", () => {
        closeElement(modal);
    })
}

async function initGraveyardPage() {
    const initialized = await initPage();
    if (initialized) {
        const deadCharacters = characters.filter(char => char.status == "deceased");
        // check if there is at least one dead character to display
        if (deadCharacters.length > 0) {
            displayCharacters(deadCharacters, graveyardContainer);

            // if user clicks on a character in the display...
            graveyardContainer.addEventListener("click", (event) => {
                // grab the specific display element
                const selectedCharElement = event.target.closest(".graveDisplay");
                if (selectedCharElement && selectedCharElement.classList.contains("dead")) {
                    // update global current modal character element
                    currentModalCharElement = selectedCharElement;
                    displayDeathDetailsModal(selectedCharElement);
                }
            })

            document.addEventListener("keydown", (event) => {
                const deathDetailsModal = document.querySelector(".deathDetailsModal");

                // grab character object ID of the corresponding character display element
                const currentCharId = currentModalCharElement.dataset.charId;
                // grabs index of the current character display's character object
                const currentCharIndex = deadCharacters.findIndex(char => char.id == currentCharId);

                if (event.key == "ArrowRight") {
                    // if current character display is not the last in the list...
                    if (currentCharIndex < deadCharacters.length - 1) {
                        const nextChar = deadCharacters[currentCharIndex + 1];
                        // grab the next corresponding character display 
                        const nextCharElement = graveyardContainer.querySelector(`[data-char-id="${nextChar.id}"]`);

                        if (nextCharElement) {
                            closeElement(deathDetailsModal);
                            currentModalCharElement = nextCharElement;
                            displayDeathDetailsModal(nextCharElement);
                        }
                    }
                }
                else if (event.key == "ArrowLeft") {
                    // if current character display is not the first in the list...
                    if (currentCharIndex > 0) {
                        const prevChar = deadCharacters[currentCharIndex - 1];
                        // grab the character display of the previous character 
                        const prevCharElement = graveyardContainer.querySelector(`[data-char-id="${prevChar.id}"]`);
                        
                        if (prevCharElement) {
                            closeElement(deathDetailsModal);
                            currentModalCharElement = prevCharElement;
                            displayDeathDetailsModal(prevCharElement);
                        }
                    }
                }

                // allow user to close modal with the escape key
                if (event.key == "Escape") {
                    closeElement(deathDetailsModal);
                    // reset global character display element
                    currentModalCharElement = null;
                }
            })
        }
        else {
            graveyardContainer.innerHTML = "<p class='noDeathText'>No characters have died in this playthrough.</p>";
        }
    }
}

// report page exclusive functions 

function displayChapterReport() {
    chapterSummaryContainer.innerHTML = "";
    const numericCurrentChapter = parseRouteRecruitmentChapter(currentChapter, currentPlaythrough.selectedRoute);

    let chaptersToProcess;

    // ternary alternative
    // (gameModes != null) ? generateChapterReport(gameModes) : generateChapterReport(gameDetails);
    if (currentPlaythrough.gameMode != null) {
        chaptersToProcess = currentPlaythrough.gameMode.chapters;
    }
    else {
        chaptersToProcess = gameDetails.chapters;
    }

    // flatten the chapters array to include route-specific chapters (those are nested more deeply than regular chapters)
    let flattenedChapters = [];
    chaptersToProcess.forEach(chapter => {
        if (chapter.type == "route-split") {
            if (currentPlaythrough.selectedRoute) {
                flattenedChapters.push(...chapter.routes[currentPlaythrough.selectedRoute]);
            }
        }
        // regular chapters
        else {
            flattenedChapters.push(chapter);
        }
    })

    flattenedChapters.forEach(chapter => {
        const numericChapterNumber = getNumericChapterValue(chapter.number);

        if (numericChapterNumber <= numericCurrentChapter) {
            const deadCharsInChapter = characters.filter(char => 
                char.status == "deceased" && char.deathChapter == chapter.number
            );

            let chapterDeathsHTML = "";
            if (deadCharsInChapter.length > 0) {
                deadCharsInChapter.forEach(deadChar => {
                    chapterDeathsHTML += `
                    <img src="${deadChar.image}" 
                        alt="${deadChar.charName}" 
                        title='${deadChar.charName} | Died in Chapter ${deadChar.deathChapter} - "${deadChar.deathNote}"'>
                    `;
                })
            }

            let chapterSummaryHTML = "";
            if (chapterDeathsHTML != "") {
                chapterSummaryHTML = `
                <div class="chapterSummary">
                    <h4>Chapter ${chapter.number}: ${chapter.name}</h4>
                    <hr>
                    <p>Deaths:</p>
                    <div class="chapterDeathsContainer">
                        ${chapterDeathsHTML}
                    </div>
                </div>
                `;
            }
            else {
                chapterSummaryHTML = `
                <div class="chapterSummary noDeaths">
                    <h4>Chapter ${chapter.number}: ${chapter.name}</h4>
                    <hr>
                    <p>No Deaths</p>
                </div>
                `;
            }

            chapterSummaryContainer.insertAdjacentHTML("beforeend", chapterSummaryHTML);
        }
    })

    if (chapterSummaryContainer.innerHTML == "") {
        chapterSummaryContainer.innerHTML = "<p>No chapters have been completed, or no data is available to display.</p>"
    }
}

async function initReportPage() {
    const initialized = await initPage();
    if (initialized) {
        displayChapterReport();
    }
}

// game select page exclusive functions

function toggleGameShelf() {
    if (gameShelf) {
        gameShelf.classList.toggle("hidden");
    }
}

function formatDate(date) {
    // month is 0-indexed, so add 1
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let year = date.getFullYear();

    const formattedDate = `${month}/${day}/${year}`;
    return formattedDate;
}

function generateSaveDataFileDisplay(id, gameCampaign, difficulty, lordName, currentChapter, dateStarted, deathCount) {
    return `
    <div class="saveFileContainer" data-save-id="${id}">
      <div class="saveHeader">
        <h4>${gameCampaign}: ${difficulty}</h4>
        <img src="images/misc/redX.png" alt="Delete save file" class="saveFileDeleteButton">
       </div>
      <div class="fileContentContainer">
        <div class="imgContainer">
          <img src="images/char-sprite/small-sprites/small-${lordName.toLowerCase()}.png" alt="${lordName} Sprite">
        </div>
        <div class="fileDetailsContainer">
          <p>
            ${dateStarted}
            <br>
            Deaths: ${deathCount} | Chapter: ${currentChapter}
          </p>
        </div>
      </div>
    </div>
    `;
}

function generateAllPlaythroughDisplayHTML() {
    let spacingContainer = document.createElement("div");
    spacingContainer.classList.add("saveFilesSpacingContainer");

    spacingContainer.innerHTML = `<div class="allSaveFilesContainer"></div>`;
    let saveFilesContainer = spacingContainer.querySelector(".allSaveFilesContainer");
    
    const existingPlaythroughs = JSON.parse(localStorage.getItem(PLAYTHROUGHS_KEY));
    if (existingPlaythroughs) {
        existingPlaythroughs.forEach(p => {
            // playthrough start date is currently a string object since it was parsed
            // a JSON file. convert it back into a date object
            const formattedDate = formatDate(new Date(p.startDate));
            saveFilesContainer.insertAdjacentHTML("beforeend", generateSaveDataFileDisplay(p.id, p.campaignName, p.selectedDifficulty, p.mainLord, p.data.currentChapter, formattedDate, p.data.deathCount));
        })
    }
    else {
        const emptySaveContainer = `<p>No existing playthroughs. Start a new one using the play button.</p>`
        saveFilesContainer.insertAdjacentHTML("beforeend", emptySaveContainer);
    }

    return spacingContainer;
}

function generateDeletePlaythroughModal() {
    return `    
    <div class="deleteConfirmModal">
      <div class="deleteConfirmModalContent">
        <p>Are you sure you want to delete this save file? This cannot be undone.</p>
        <div class="deleteFileButtonsContainer">
          <button class="deleteYesButton">Yes</button>
          <button class="deleteNoButton">No</button>
        </div>
      </div>
    </div>
    `;
}

function generateUniqueId() {
    const dateString = Date.now().toString(36);
    const randomNumbers = Math.random().toString(36).substring(2, 9);

    const uniqueId = dateString + randomNumbers;
    return uniqueId;
}

function saveNewPlaythrough(gameId, selectedDifficulty, gameMode = null) {
    const newPlaythrough = {
        id: generateUniqueId(),
        startDate: new Date(),
        gameId: gameId,
        selectedDifficulty: selectedDifficulty,
        campaignName: gameMode ? gameMode.name : gameDetails.name,
        mainLord : gameMode ? gameMode.mainLord : gameDetails.mainLord,
        data: {
            characters: [],
            currentChapter: null,
            deathCount: 0
        }
    }

    if (gameMode != null) {
        newPlaythrough.gameMode = gameMode;
    }
    
    // retrieve existing playthrough data. if there are no playthroughs, assign empty array to the variable
    const existingPlaythroughs = JSON.parse(localStorage.getItem(PLAYTHROUGHS_KEY)) || [];

    existingPlaythroughs.push(newPlaythrough);
    localStorage.setItem(PLAYTHROUGHS_KEY, JSON.stringify(existingPlaythroughs));
    
    // set the ID of the current playthrough
    localStorage.setItem(CURRENT_PLAYTHROUGH_KEY, newPlaythrough.id);
}

function getCurrentPlaythrough() {
    const currentPlaythroughId = localStorage.getItem(CURRENT_PLAYTHROUGH_KEY);
    const existingPlaythroughs = JSON.parse(localStorage.getItem(PLAYTHROUGHS_KEY));

    if (!currentPlaythroughId || !existingPlaythroughs) {
        return null;
    }

    const currentPlaythrough = existingPlaythroughs.find(playthrough => playthrough.id == currentPlaythroughId);
    return currentPlaythrough;
}

function setCurrentPlaythrough(playthrough) {
    localStorage.setItem(CURRENT_PLAYTHROUGH_KEY, playthrough.id);
}

function deletePlaythrough(existingPlaythroughs, selectedPlaythrough, selectedSaveContainer) {
    const selectedPlaythroughIndex = existingPlaythroughs.findIndex(p => p.id == selectedPlaythrough.id);

    if (selectedPlaythroughIndex > -1) {
        existingPlaythroughs.splice(selectedPlaythroughIndex, 1);
        localStorage.setItem(PLAYTHROUGHS_KEY, JSON.stringify(existingPlaythroughs));
    }

    selectedSaveContainer.remove();
}

function generateBlazingModeOptionsHTML() {
    let optionsHTML = "";

    // go through each game mode in blazingblade.json and add its respective id, main lord, and name to a string variable
    gameModes.forEach(mode => {
        optionsHTML += 
        `
        <div class="charModeOption" data-mode-id="${mode.id}">
          <div class="charModeTitle">
            <p>${mode.name}</p>
          </div>
          <img src="images/char-sprite/small-sprites/small-${mode.mainLord.toLowerCase()}.png" alt="${mode.mainLord} Sprite">
        </div>
        `;
    })

    // place that string variable in another string variable that acts as a div container (for styling purposes)
    const containerHTML = 
    `
    <div class="blazingOptionsModal">
      <div class="blazingOptionsModalContent">
        <div class="closeButtonContainer">
          <button class="closeButton blazing">X</button>
        </div>
        <div class="blazingModesContainer">
          <img src="images/misc/fe7-cover.png" alt="Fire Emblem 7 Cover" class="optionsCover">
          <div class="blazingModes">
            ${optionsHTML}
          </div>
        </div>
      </div>
    </div>
      `;

    return containerHTML;
}

function generateGameOptionsModal(gameDetails) {
    return `
    <div class="blazingOptionsModal">
      <div class="blazingOptionsModalContent">
        <div class="closeButtonContainer">
          <button class="closeButton blazing">X</button>
        </div>
        <div class="blazingModesContainer">
          <img src="images/misc/${gameDetails.abbreviation}-cover.png" alt="${gameDetails.gameName} Cover" class="optionsCover">
        </div>
      </div>
    </div>
    `;
}

function generateDifficultyOptionsHTML(gameData) {
    let optionsHTML = "";
    gameData.difficultyOptions.forEach(difficulty => {
        optionsHTML += 
        `<div class="difficultyOption" data-difficulty-id="${difficulty}">${difficulty}</div>`;
    })
    const containerHTML = `<div class="difficultyOptionsContainer">${optionsHTML}</div>`;
    return containerHTML;
}

function generateSettingsConfirmationModal(gameId, selectedDifficulty, gameMode = null) {
    let settingsConfirmationHTML;
    if (gameMode != null) {
        settingsConfirmationHTML = `
          <div class="settingsConfirmationContent">
            <h4>Start with these settings?</h4>
            <p>${gameId}</p>
            <p>${gameMode}: ${selectedDifficulty} Mode</p>
            <div class="settingConfirmationButtons">
              <button id="confirmSettingsButton">Yes</button>
              <button id="rejectSettingsButton">No</button>
            </div>
          </div>
          `;
    }
    else {
        settingsConfirmationHTML = `
           <div class="settingsConfirmationContent">
             <h4>Start with these settings?</h4> 
             <p>${gameId}</p>
             <p>${selectedDifficulty} Mode</p>
             <div class="settingConfirmationButtons">
               <button id="confirmSettingsButton">Yes</button>
               <button id="rejectSettingsButton">No</button>
             </div>
           </div>
           `;
    }
    
    return settingsConfirmationHTML;
}

function setupOptionsModalCloseHandlers() {
    const closeButton = document.querySelector(".closeButton.blazing");
    const blazingOptionsModal = document.querySelector(".blazingOptionsModal");

    if (blazingOptionsModal && closeButton) {
        closeButton.addEventListener("click", () => {
            closeElement(blazingOptionsModal);
        })
    }

    const handleEscape = (event) => {
        if (event.key == "Escape") {
            const modal = document.querySelector(".blazingOptionsModal");
            if (modal) {
                closeElement(blazingOptionsModal);
                // removes event listener after use so it doesn't stack
                document.removeEventListener("keydown", handleEscape);
            }
        }
    }   

    document.addEventListener("keydown", handleEscape);
}

// ADD THIS TO INIT GAME SELECT PAGE AND REPLACE THE OTHER CODE (BOTH THE BLAZING AND NON BLAZING)

// ALSO CHANGE THIS TO LOOK LIKE THE FUNCTION ABOVE (setupOptionsModalCloseHandlers())
// function setupSettingsModalHandler() {
//     const settingsConfirmationContainer = document.querySelector(".settingsConfirmationContent");

//     settingsConfirmationContainer.addEventListener("click", (event) => {
//         if (event.target.id == "confirmSettingsButton") {
//             // create new playthrough data and save to localStorage
//             saveNewPlaythrough(selectedGameId, selectedDifficultyId, selectedMode);
//             // navigate to tracker page with user's selected game settings
//             window.location.href="index.html";
//         }
//         else if (event.target.id == "rejectSettingsButton") {
//             closeElement(blazingOptionsModal);
//         }
//     })

// }

function getGameDataFile(gameId) {
    switch (gameId) {
        case "blazing":
            return "fe-game-data/blazingblade.json";
        case "binding":
            return "fe-game-data/bindingblade.json";
        case "sacred":
            return "fe-game-data/sacredstones.json";
        default:
            console.error("Unknown game ID:", gameId);
            return null;
    }
}

async function initGameSelectPage() {
    const initialized = await initPage();
    if (initialized) {
        if (gameShelf) {
            gameShelf.addEventListener("click", async (event) => {
                // grab the game element that was clicked
                let selectedGameElement = event.target.closest(".gameCover");
                // match it based on its custom game-id attribute
                let selectedGameId = selectedGameElement.dataset.gameId;

                if (selectedGameId) {
                    if (selectedGameId == "blazing") {
                        const gameData = await fetchGameData(getGameDataFile(selectedGameId));
                        if (gameData) {
                            gameModes = gameData.gameModes;

                            main.insertAdjacentHTML("beforeend", generateBlazingModeOptionsHTML());
                            setupOptionsModalCloseHandlers();

                            main.addEventListener("click", (event) => {
                                let selectedModeElement = event.target.closest(".charModeOption");
                                if (selectedModeElement) {
                                    const selectedMode = gameModes.find(gameMode => gameMode.id == selectedModeElement.dataset.modeId);
                                    const selectedModeName = selectedMode.name;

                                    let difficultiesContainer = document.querySelector(".difficultyOptionsContainer");
                                    const blazingOptionsModalContent = document.querySelector(".blazingOptionsModalContent");
                                    if (!difficultiesContainer) {
                                        blazingOptionsModalContent.insertAdjacentHTML("beforeend", generateDifficultyOptionsHTML(selectedMode));
                                        // reassign variable (should have been null before) and grab the correct element
                                        difficultiesContainer = document.querySelector(".difficultyOptionsContainer");

                                        difficultiesContainer.addEventListener("click", (event) => {
                                            let selectedDifficultyElement = event.target.closest(".difficultyOption");
                                            if (selectedDifficultyElement) {
                                            let selectedDifficultyId = selectedDifficultyElement.dataset.difficultyId;
                                            const selectedGameName = selectedMode.gameName;
                                            
                                            blazingOptionsModalContent.innerHTML = generateSettingsConfirmationModal(selectedGameName, selectedDifficultyId, selectedModeName);
                                            const settingsConfirmationContainer = document.querySelector(".settingsConfirmationContent");

                                            settingsConfirmationContainer.addEventListener("click", (event) => {
                                            if (event.target.id == "confirmSettingsButton") {
                                                    // create new playthrough data and save to localStorage
                                                    saveNewPlaythrough(selectedGameId, selectedDifficultyId, selectedMode);
                                                    // navigate to tracker page with user's selected game settings
                                                    window.location.href="index.html";
                                                }
                                                else if (event.target.id == "rejectSettingsButton") {
                                                    closeElement(blazingOptionsModal);
                                                }
                                            })
                                            }
                                        })
                                    }
                                }
                            })
                        }
                    }

                    else {
                        const gameData = await fetchGameData(getGameDataFile(selectedGameId));
                        if (gameData) {
                            gameDetails = gameData.gameDetails;

                            main.insertAdjacentHTML("beforeend", generateGameOptionsModal(gameDetails));

                            const blazingOptionsModalContent = document.querySelector(".blazingOptionsModalContent");
                            blazingOptionsModalContent.insertAdjacentHTML("beforeend", generateDifficultyOptionsHTML(gameDetails));
                            setupOptionsModalCloseHandlers();

                            const difficultiesContainer = document.querySelector(".difficultyOptionsContainer");
                            difficultiesContainer.addEventListener("click", (event) => {
                                let selectedDifficultyElement = event.target.closest(".difficultyOption");
                                const selectedDifficultyId = selectedDifficultyElement.dataset.difficultyId;
                                const selectedGameName = gameData.gameDetails.gameName;

                                blazingOptionsModalContent.innerHTML = generateSettingsConfirmationModal(selectedGameName, selectedDifficultyId);
                                const settingsConfirmationContainer = document.querySelector(".settingsConfirmationContent");

                                settingsConfirmationContainer.addEventListener("click", (event) => {
                                    if (event.target.id == "confirmSettingsButton") {
                                        // create new playthrough data and save to localStorage
                                        saveNewPlaythrough(selectedGameId, selectedDifficultyId);
                                        // navigate to tracker page with user's selected game settings
                                        window.location.href="index.html";
                                    }
                                    else if (event.target.id == "rejectSettingsButton") {
                                        closeElement(blazingOptionsModal);
                                    }
                                })
                            })

                        }
                    }
                }
            })
        }

        if (loadButton) {
            loadButton.addEventListener("click", () => {
                loadButton.classList.toggle("selected");

                let playthroughsDisplay = document.querySelector(".saveFilesSpacingContainer");
                if (loadButton.classList.contains("selected")) {
                    if (!playthroughsDisplay && gameShelf.classList.contains("hidden")) {
                        main.insertAdjacentElement("beforeend", generateAllPlaythroughDisplayHTML());
                    }
                }
                else {
                    if (playthroughsDisplay) {
                        playthroughsDisplay.remove();
                    }
                }

                const allSavesContainer = document.querySelector(".allSaveFilesContainer");
                if (allSavesContainer) {
                    allSavesContainer.addEventListener("click", (event) => {
                        handleSaveFileClicks(event);
                    })
                }
            })
        }
    }
}

function deleteConfirmationModalHandler(existingPlaythroughs, selectedPlaythrough, selectedSaveContainer) {
    const deleteConfirmationModal = document.querySelector(".deleteConfirmModal");
    const yesButton = document.querySelector(".deleteYesButton");
    const noButton = document.querySelector(".deleteNoButton");

    function handleYesClick() {
        deletePlaythrough(existingPlaythroughs, selectedPlaythrough, selectedSaveContainer);

        yesButton.removeEventListener("click", handleYesClick);
        noButton.removeEventListener("click", handleNoClick);
        deleteConfirmationModal.remove();
    }

    function handleNoClick() {
        yesButton.removeEventListener("click", handleYesClick);
        noButton.removeEventListener("click", handleNoClick);
        deleteConfirmationModal.remove();
    }

    yesButton.addEventListener("click", handleYesClick);
    noButton.addEventListener("click", handleNoClick);
}

function handleSaveFileClicks(event) {
    const deleteButton = event.target.closest(".saveFileDeleteButton");
    const selectedSaveContainer = event.target.closest(".saveFileContainer");

    const existingPlaythroughs = JSON.parse(localStorage.getItem(PLAYTHROUGHS_KEY));
    const selectedPlaythrough = existingPlaythroughs.find(p => p.id == selectedSaveContainer.dataset.saveId);

    if (!selectedPlaythrough) {
        console.log("No playthrough data found.")
        return;
    }

    if (deleteButton) {
        // stop the click from continuing to load the logic below (a saveFileContainer will be selected in either scenario, 
        // so it will always run without this line)
        event.stopPropagation();

        body.insertAdjacentHTML("beforeend", generateDeletePlaythroughModal());
        deleteConfirmationModalHandler(existingPlaythroughs, selectedPlaythrough, selectedSaveContainer);
        return;
    }

    if (selectedPlaythrough) {
        setCurrentPlaythrough(selectedPlaythrough);
        window.location.href="index.html";
    }
    
}

if (resetButton) {
    resetButton.addEventListener("click", () => {
        resetButton.classList.add("selected");
        resetModalHandler();
    })
}

if (playButton) {
    playButton.addEventListener("click", () => {
        playButton.classList.toggle("selected");

        if (playButton.classList.contains("selected")) {
            toggleGameShelf();
        }
        else {
            toggleGameShelf();
        }
    })
}

// event listeners
if (chapSelect) {
    chapSelect.addEventListener("change", () => {
        // THIS...
        const newChapter = chapSelect.value;

        // MAYBE ADD ANOTHER CONDITION TO THIS TO PREVENT ROUTE SPLIT CHAPTERS FROM STACKING 
        // AND THIS NEED TO BE CHANGED (JUST FOR TESTING PURPOSES)
        if (currentPlaythrough.gameId == "sacred" && newChapter == "8.5") {
            body.insertAdjacentHTML("beforeend", generateSacredStonesRouteSplitModal());
            sacredStonesRouteSplitModalHandler();
        }

        // update current chapter
        currentChapter = chapSelect.value;
        // Get filtered characters
        const filteredChars = filterCharactersByChapter();
        // Call displayCharacters with filtered list
        displayCharacters(filteredChars, charContainer);
        saveGameDataToStorage();
    })
}

if (prevButton) {
    prevButton.addEventListener("click", () => {
        updateChapter("prev");

        const filteredChars = filterCharactersByChapter();
        displayCharacters(filteredChars, charContainer);
        saveGameDataToStorage();
    })
}

if (nextButton) {
    nextButton.addEventListener("click", () => {
        updateChapter("next");

        // THESE NEED TO BE REPLACED/REMOVED (FOR TESTING)
        const newChapter = chapSelect.value;

        // AND THIS NEED TO BE CHANGED (JUST FOR TESTING PURPOSES)
        if (currentPlaythrough.gameId == "sacred" && newChapter == "8.5") {
            body.insertAdjacentHTML("beforeend", generateSacredStonesRouteSplitModal());
            sacredStonesRouteSplitModalHandler();
        }

        const filteredChars = filterCharactersByChapter();
        displayCharacters(filteredChars, charContainer);
        saveGameDataToStorage();
    })
}

if (charContainer) {
    // call toggleCharacterPortrait when user clicks on a unit display
    charContainer.addEventListener("click", (event) => {
        // grab the specific character display clicked
        let selectedCharElement = event.target.closest(".charDisplay");
        // if user selects a unit display and the unit is not already dead...
        if (selectedCharElement && !selectedCharElement.classList.contains("dead")) {
            // open the modal
            modalHandler(selectedCharElement);
        }
    })
}

document.addEventListener("DOMContentLoaded", () => {
    if (document.body.id == "tracker-page") {
        initTrackerPage();
    }
    else if (document.body.id == "graveyard-page") {
        initGraveyardPage();
    }
    else if (document.body.id == "report-page") {
        initReportPage();
    }
    else if (document.body.id == "game-select-page") {
        initGameSelectPage();
    }
})