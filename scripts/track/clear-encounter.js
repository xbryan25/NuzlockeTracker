import {activePokemonEvolutionLines, activePokemonInCombobox, activePokemonNoEvolutionLines} from "./active-data.js";
import { updateDupeSubstring } from "./display-dupe.js";
import getEvolutionLine from "./get-evolution-line.js";

export async function clearEncounter(location, encounterRouteObjects){
  // ----- For the combobox

  // Removes the CSS class that changes the color of the combobox
  let locationEncounterCombobox = document.querySelector(`.js-encounter-${location}`);
  locationEncounterCombobox.classList.remove("selected-encounter");

  let locationEncounterComboboxActive = locationEncounterCombobox.querySelector(`.js-${location}-encounter-display`);

  // If a pokemon is selected in the combobox 
  if (locationEncounterComboboxActive){ 
    let getSelectedPokemon = locationEncounterComboboxActive.value;
    let getSelectedPokemonLowercase = getSelectedPokemon.toLowerCase();
    
    let selectedPokemonEvolutionLine = await getEvolutionLine(getSelectedPokemonLowercase);
    let selectedPokemonEvolutionLineLength = selectedPokemonEvolutionLine.length;

    // Get the index of the base evolution of a pokemon species
    let selectedPokemonBaseEvolutionIndex = activePokemonInCombobox.indexOf(selectedPokemonEvolutionLine[0]);

    // This one is for the index of the evolution lines, since the evolution lines is per species already
    // This one is also for the index of activePokemonNoEvolutionLines
    let selectedPokemonIndex = activePokemonNoEvolutionLines.indexOf(getSelectedPokemon);

    activePokemonInCombobox.splice(selectedPokemonBaseEvolutionIndex, selectedPokemonEvolutionLineLength);
    activePokemonNoEvolutionLines.splice(selectedPokemonIndex, 1);
    activePokemonEvolutionLines.splice(selectedPokemonIndex, 1);

    locationEncounterComboboxActive.remove();

    locationEncounterCombobox.value = "none";

    updateDupeSubstring(encounterRouteObjects);
  }

  // ----- For the input tag

  let locationNickname = document.querySelector(`.js-${location}-nickname`);
  locationNickname.value = '';

  // ----- For the status and natures comboboxes

  let statusAndNaturesComboboxes = document.querySelectorAll(`.js-${location}-status-and-nature-combobox`);

  statusAndNaturesComboboxes.forEach(element => {
    element.value = "none";
    element.classList.remove("selected-status-or-nature")
  })

  // Index 0 is for the status combobox, index 1 is for the natures combobox
  // Setting the comboboxes to none will revert the value back to its preselected form
  // statusAndNaturesComboboxes[0].value = "none";
  // statusAndNaturesComboboxes[1].value = "none";

  let locationKillButton = document.querySelector(`.js-death-${location}-button`);
  locationKillButton.style.display = "none";

  let locationEvolveButton = document.querySelector(`.js-evolve-${location}-button`);
  locationEvolveButton.style.display = "none";

}

export function clearAllEncounters(encounterRouteObjects){

  if (confirm("Are you sure you want to erase your inputs?")){
    activePokemonEvolutionLines = [];
    activePokemonInCombobox = [];
    activePokemonNoEvolutionLines = [];

    encounterRouteObjects.forEach(encounterRouteObject => {
      let locationNoSpace = (encounterRouteObject.location).split(' ').join('');

      document.querySelector(`.js-encounter-${locationNoSpace}`).value = "none";
      document.querySelector(`.js-encounter-${locationNoSpace}`).classList.remove("selected-encounter");

      document.querySelector(`.js-${locationNoSpace}-nickname`).value = '';

      let statusAndNaturesComboboxes = document.querySelectorAll(`.js-${locationNoSpace}-status-and-nature-combobox`);

      statusAndNaturesComboboxes.forEach(element => {
        element.value = "none";
        element.classList.remove("selected-status-or-nature");
      });

      updateDupeSubstring(encounterRouteObjects);
    });
  }

}