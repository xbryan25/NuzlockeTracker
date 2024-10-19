import {retrieveEvolutionLine} from "./utils.js";
import {activePokemonEvolutionLines, activePokemonInCombobox, activePokemonNoEvolutionLines} from "./active-data.js";

export function showKillPokemonButton(location){
  let targetStatusCombobox = document.querySelectorAll(`.js-${location}-status-and-nature-combobox`)[0];
  let targetEncounterCombobox = document.querySelector(`.js-encounter-${location}`);

  if (targetStatusCombobox.value === "Captured" && targetEncounterCombobox.value !== "none"){
    document.querySelector(`.js-death-${location}-button`).style.display = "flex";
  }
}

export async function showEvolvePokemonButton(location){
  let evolveButton = document.querySelector(`.js-evolve-${location}-button`);

  let selectedPokemonInEncounterCombobox = document.querySelector(`.js-encounter-${location}`).value;

  let getEvolutionLineOfSelectedPokemon = await retrieveEvolutionLine(location);

  let selectedPokemonIndex = getEvolutionLineOfSelectedPokemon.indexOf(selectedPokemonInEncounterCombobox);

  let targetStatusCombobox = document.querySelectorAll(`.js-${location}-status-and-nature-combobox`)[0];
  let targetEncounterCombobox = document.querySelector(`.js-encounter-${location}`);

  // For the last condition, if the selectedPokemonIndex is less than the length of the evolution line, it must mean that
  // the selected pokemon can still evolve

  let fromBranchedEvolution = false;
  let fromBranchedEvolutions = ["Vileplume", "Bellossom", "Poliwrath", "Politoed", "Slowbro", "Slowking",
      "Gardevoir", "Gallade", "Ninjask", "Shedinja", "Huntail", "Gorebyss"]

  if (fromBranchedEvolutions.includes(selectedPokemonInEncounterCombobox)){
    fromBranchedEvolution = true;
  }


  if (targetStatusCombobox.value === "Captured" && targetEncounterCombobox.value !== "none" && selectedPokemonIndex < getEvolutionLineOfSelectedPokemon.length - 1 && !fromBranchedEvolution){
    evolveButton.style.display = "flex";
    

  } else{
    evolveButton.style.display = "none";
  }
}