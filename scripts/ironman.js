// variable declarations 

let characters;
// for blazing blade
let gameModes;
// for sacred stones and binding blade
let gameDetails;
let currentSelectedGameMode;
let currentChapter;
let currentModalCharElement;


// key for storing dead characters in localStorage
const LOCAL_STORAGE_KEY = "fireEmblemIronmanSave";

const charContainer = document.querySelector(".characterContainer");
const chapSelect = document.querySelector("#chapSelect");
const prevButton = document.querySelector("#prevButton");
const nextButton = document.querySelector("#nextButton");

const graveyardContainer = document.querySelector(".graveyardContainer");

const chapterSummaryContainer = document.querySelector(".chapterSummaryContainer");

const playButton = document.querySelector(".playButton");
const resetButton = document.querySelector(".resetGameButton");

let main = document.querySelector("main");


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
    // grab the array of characters saved in local storage
    const savedGameDataString = localStorage.getItem(LOCAL_STORAGE_KEY);

    // if there's no saved data, return (keep all characters in their initial state)
    if (!savedGameDataString) {
        return;
    }

    // parse the string into an object
    const loadedGameData = JSON.parse(savedGameDataString);
    // grab selected game mode
    const currentSelectedModeId = localStorage.getItem("selectedGameMode");
    // check if loaded save data matches current selected mode
    if (loadedGameData.selectedGameModeId != currentSelectedModeId) {
        console.log("Save data belongs to a different game mode. Starting fresh for the new mode.");
        // don't load save data if it's for a different mode.
        return;
    }
    // check if there's a characters property in the loaded game data
    if (loadedGameData.characters) {        
        // load character state
        loadedGameData.characters.forEach(loadedChar => {
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
        if (loadedGameData.currentChapter != null) {
            // update global chapter variable
            currentChapter = loadedGameData.currentChapter;
            if (chapSelect) {
                // update dropdown to reflect the loaded chapter
                chapSelect.value = currentChapter;
            }
        }
    }
}

function saveGameDataToStorage() {
    const saveData = {
        // the characters array 
        characters: characters,
        // the current chapter (global variable)
        currentChapter: currentChapter,
        // get the ID of the game mode selected from the game select page
        selectedGameModeId: localStorage.getItem("selectedGameMode")
    };
    // saves global characters array, current chapter, and game mode ID in string format to localStorage
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(saveData));
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

function populateChapterDropdown(gameMode) {
    // clear dropdown options so they don't stack and initialize base value 
    chapSelect.innerHTML = `<option value="">All</option>`;
    // populate chapter dropdown based on what mode you're playing
    gameMode.chapters.forEach(chapter => {
        const chapterNum = document.createElement("option");
        chapterNum.value = chapter.number;
        chapterNum.textContent = `Chapter ${chapter.number}: ${chapter.name}`;
        chapSelect.append(chapterNum);
    })

    chapSelect.selectedIndex = 1;
    currentChapter = chapSelect.value;
}

// filter helper function
function filterJoinChapter(character) {
    // convert all chapter values (gaiden chapters are initially strings) to numbers for comparison between join chapter and selected chapter
    const selectedChapter = getNumericChapterValue(chapSelect.value);
    return character.joinChapter <= selectedChapter;
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

function generateDeathConfirmationModal(characterName, chapter) {
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
                  <img src="images/char-sprite/fe7/${characterName.toLowerCase()}.png">
                </div>
                <p>Did <span class="deathModalSpecialText">${characterName}</span> fall in battle?</p>
              </div>
            </div>

            <div class="deathConfirmationContainer">
              <button id="yesButton">Yes</button>
              <button id="noButton">No</button>
            </div>
          </div>

          <div class="deathNoteSection hidden"> 
            <p>How did <span class="deathModalSpecialText">${characterName}</span> meet their end? (Optional)</p>
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

    // grab the character's name
    const characterName = characterForModal.charName;
    // display the modal
    document.body.insertAdjacentHTML("beforeend", generateDeathConfirmationModal(characterName, currentChapter));

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
        const deathNote = deathNoteInputBox.value.trim();
        // if user leaves it blank, provide a generic death description
        if (deathNote == "") {
            deathNote = "Died fighting for a better future.";
            saveDeathNote(character, deathNote, characterDisplayElement);
        }
        else {
            saveDeathNote(character, deathNote, characterDisplayElement);
        }
    });

    cancelButton.addEventListener("click", closeDeathModal)
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

    saveGameDataToStorage();
    // update character display to show dead class styling
    characterDisplayElement.classList.add("dead");
    closeDeathModal();
}

function gameOverModalHTML() {
    return `
    <div class="gameOverModal">
      <div class="gameOverModalContent">
        <img src="images/misc/fe7-game-over.png alt="Game over screen">
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
    // save reset game data to local storage (character status and current chapter)
    saveGameDataToStorage();

    if (document.body.id == "tracker-page" && charContainer) {
        // clear character container
        charContainer.innerHTML = "";
        filteredChars = filterCharactersByChapter();
        // reset character display 
        displayCharacters(filteredChars, charContainer);
    }
}

function closeElement(element) {
    if (element) {
        element.remove();
    }
}

async function initPage() {
    // USING blazingblade.json FOR TESTING PURPOSES
    // fetch the data for the game chosen 
    const fetchedData = await fetchGameData("fe-game-data/blazingblade.json");

    if (fetchedData) {
        // assign values to global variables based on fetched game data
        characters = fetchedData.characters;
        // check if game has different modes (blazing blade)
        if (fetchedData.gameModes) {
            gameModes = fetchedData.gameModes;
        }
        // else, update global gameDetails variable
        else if (fetchedData.gameDetails) {
            gameDetails = fetchedData.gameDetails;
        }
        const selectedModeIdFromStorage = localStorage.getItem("selectedGameMode");

        // if user has selected a mode, set global variable
        if (selectedModeIdFromStorage) {
            currentSelectedGameMode = gameModes.find(mode => mode.id == selectedModeIdFromStorage);
        }

        // if user has not selected a mode...
        if (!currentSelectedGameMode) {
            // set default to Eliwood mode
            currentSelectedGameMode = gameModes.find(mode => mode.id == 2);

            // if default doesn't exist, return and stop function
            if (!currentSelectedGameMode) {
                console.error("Default game mode not found. Cannot initialize tracker.");
                return;
            }
        }

        const modeCharacters = currentSelectedGameMode.charactersInMode.map(modeChar => {
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
        loadGameDataFromStorage();
        return true;
    }
    else {
        console.error("Failed to load game data. Page may not function correctly.");
        return false;
    }
}

async function initTrackerPage() {
    const initialized = await initPage();
    if (initialized) {
        populateChapterDropdown(currentSelectedGameMode);
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
    const numericCurrentChapter = getNumericChapterValue(currentChapter);

    currentSelectedGameMode.chapters.forEach(chapter => {
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

function gameShelfModalHTML() {
    return `
    <div class="shelfContainerContainer">
        <div class="shelfContainer">
          <img
            class="shelfImg"
            src="images/misc/game-shelf-full.png"
            alt="Wooden Shelf"
          />
          <div class="gameSelectContainer">
            <div class="fe6Container">
              <img
                class="gameCover"
                data-game-id="binding"
                src="images/misc/fe6-cover.png"
                alt="Fire Emblem 6 Cover"
                title="Fire Emblem: The Binding Blade"
              />
            </div>
            <div class="fe7Container">
              <img
                class="gameCover"
                data-game-id="blazing"
                src="images/misc/fe7-cover.png"
                alt="Fire Emblem 7 Cover"
                title="Fire Emblem: The Blazing Blade"
              />
            </div>
            <div class="sacredContainer">
              <img
                class="gameCover"
                data-game-id="sacred"
                src="images/misc/fe8-cover.png"
                alt="Fire Emblem 8 Cover"
                title="Fire Emblem: The Sacred Stones"
              />
            </div>
          </div>
        </div>
      </div>
    `;
}

function closeGameShelfModal() {
    const gameShelfModal = document.querySelector(".shelfContainerContainer");
    closeElement(gameShelfModal);
}

function displayGameShelf() {
    main.insertAdjacentHTML("beforeend", gameShelfModalHTML());
}

function generateSaveDataContainer() {
    return `
    <div class="saveFilesSpacingContainer">
      <div class="allSaveFilesContainer"></div>
    </div>
    `;
}

function generateSaveDataFileDisplay(gameMode, difficulty, deathCount, lordName, currentChapter, lastPlayedDate) {
    return `
    <div class="saveFileContainer">
      <div class="saveHeader">
        <h4>${gameMode} ${difficulty}</h4>
       </div>
      <div class="fileContentContainer">
        <div class="imgContainer">
          <img src="images/char-sprite/small-sprites/small-${lordName.toLowerCase()}.png" alt="${lordName} Sprite">
        </div>
        <div class="fileDetailsContainer">
          <p>
            ${lastPlayedDate}
            <br>
            Deaths: ${deathCount} | Chapter: ${currentChapter}
          </p>
        </div>
      </div>
    </div>
    `;
}

function generateBlazingModeOptionModal() {
    let optionsHTML = "";

    // go through each game mode in blazingblade.json and add its respective id, main lord, and name to a string variable
    gameModes.forEach(mode => {
        optionsHTML += 
        `
        <div class="charModeOption" data-mode-id="${mode.id}">
          <div class="charModeTitle">
            <p>${mode.name}</p>
          </div>
          <img src="images/char-sprite/fe7/small-sprites/small-${mode.mainLord.toLowerCase()}.png" alt="${mode.mainLord} Sprite">
        </div>
        `;
    })

    // place that string variable in another string variable that acts as a div container (for styling purposes)
    const containerHTML = 
    `
    <div class="blazingOptionsModal">
      <div class="blazingOptionsModalContent">
        <div class="blazingModesContainer">
          <img src="images/misc/fe7-cover.png" alt="Fire Emblem 7 Cover">
          <div class="blazingModes">
          ${optionsHTML}
          </div>
        </div>
      </div>
    </div>
      `;
    main.insertAdjacentHTML("beforeend", containerHTML);
}

function generateBlazingDifficulties(selectedMode) {
    let optionsHTML = "";
    selectedMode.difficultyOptions.forEach(difficulty => {
        optionsHTML += 
        `<div class="difficultyOption" data-difficulty-id="${difficulty}">${difficulty}</div>`;
    })
    const containerHTML = `<div class="difficultyOptionsContainer">${optionsHTML}</div>`;
    const blazingOptionsModalContent = document.querySelector(".blazingOptionsModalContent");
    if (blazingOptionsModalContent) {
        // const blazingModesContainer = document.querySelector(".blazingModesContainer");
        // closeElement(blazingModesContainer);
        blazingOptionsModalContent.insertAdjacentHTML("beforeend", containerHTML);
    }
}

// add a back button and an X button in the options modal

function generateGameOptionsModal(selectedGameId) {
    let optionsHTML = "";

    if (selectedGameId == "binding" || selectedGameId == "sacred") {
        for (let i = 0; i < 3; i++) {
            optionsHTML += `<div class="difficultyOption">${gameDetails.difficultyOptions[i]}</div>`;
        }

        const containerHTML = `<div class="difficultyOptionsContainer">${optionsHTML}</div>`;
        main.insertAdjacentHTML("beforeend", containerHTML);
    }
    else if (selectedGameId == "blazing") {
        const modesContainer = document.querySelector(".blazingModesContainer");
        if (!modesContainer) {
            generateBlazingModeOptionModal();
        }
    }
}

function gameOptionsModalHandler() {
    const gameShelf = document.querySelector(".shelfContainer");
    if (gameShelf) {
        gameShelf.addEventListener("click", (event) => {
            // grab the game element that was clicked
            let selectedGameElement = event.target.closest(".gameCover");
            // match it based on its custom game-id attribute
            selectedGameId = selectedGameElement.dataset.gameId;

            if (selectedGameId) {
                generateGameOptionsModal(selectedGameId);
            }
        })
    }
}

async function initGameSelectPage() {
    const initialized = await initPage();
    if (initialized) {

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
            displayGameShelf();
            gameOptionsModalHandler();
        }
        else {
            closeGameShelfModal();
        }
    })
}

// event listeners
if (chapSelect) {
    chapSelect.addEventListener("change", () => {
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
        main.addEventListener("click", (event) => {
            let selectedModeElement = event.target.closest(".charModeOption");
            if (selectedModeElement) {
                const selectedMode = gameModes.find(gameMode => gameMode.id == selectedModeElement.dataset.modeId);
                const difficultiesContainer = document.querySelector(".difficultyOptionsContainer");
                if (!difficultiesContainer) {
                    generateBlazingDifficulties(selectedMode);
                }
            }
        })
    }
})