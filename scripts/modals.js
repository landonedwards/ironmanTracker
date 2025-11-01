// all modal HTML

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



// modal handlers

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

