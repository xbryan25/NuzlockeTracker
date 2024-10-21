import {activePokemonEvolutionLines, activePokemonInCombobox, activePokemonNoEvolutionLines} from "./active-data.js";

export function removeEncounterDisplays(location){
	let encounterDisplaysQuery = document.querySelectorAll(`.js-${location}-encounter-display`);

	encounterDisplaysQuery.forEach(encounterDisplay => {
		encounterDisplay.remove();
	});
}

async function getEvolutionLine(pokemon){
  //  The goal of this function is to return an array that contains the evolution chain of the given pokemon
  let pokemonInfoResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
  let pokemonInfoResponseJSON = await pokemonInfoResponse.json();
  let getSpeciesLink = pokemonInfoResponseJSON ['species']['url'];
  
  let pokemonSpeciesResponse = await fetch(`${getSpeciesLink}`);
  let pokemonSpeciesResponseJSON = await pokemonSpeciesResponse.json();
  let getEvolutionChainLink = pokemonSpeciesResponseJSON['evolution_chain']['url'];

  let pokemonEvolutionChainResponse = await fetch(`${getEvolutionChainLink}`);
  let pokemonEvolutionChainResponseJSON = await pokemonEvolutionChainResponse.json();

  // pokemonEvolutionChain can also be called baseEvolution
  let pokemonEvolutionChain = pokemonEvolutionChainResponseJSON['chain']

  let evolutionLine = [];

  // base evolution (not done in a loop because pokemonEvolutionChain is not iterable)
  evolutionLine.push(pokemonEvolutionChain['species']['name']);

  if (pokemonEvolutionChain['evolves_to'].length !== 0){

    // second evolution
    let secondEvolutions = pokemonEvolutionChain['evolves_to'];

    secondEvolutions.forEach(secondEvolution => {
      evolutionLine.push(secondEvolution['species']['name']);

      if (secondEvolution['evolves_to'].length !== 0){
        let third_evolutions = secondEvolution['evolves_to'];

        third_evolutions.forEach(third_evolution => {
          evolutionLine.push(third_evolution['species']['name']);
        });

        // Only stop at third evolution because pokemon can only have two evolutions at maximum 
      }
    });
  }


  // for (let evolution of evolutionLine){
  //   titleCaseEvolutionLine.push(evolution.charAt(0).toUpperCase() + evolution.slice(1));
  // }

  let titleCaseEvolutionLine = evolutionLine.map(evolution => {
                                return evolution.charAt(0).toUpperCase() + evolution.slice(1);
                              });

  return titleCaseEvolutionLine;
}

export function activeStatusOrNature(location){
  let statusAndNatureComboboxes = document.querySelectorAll(`.js-${location}-status-and-nature-combobox`);

  // Index 0 is for the status combobox, index 1 is for the natures combobox
  let statusCombobox = statusAndNatureComboboxes[0];
  let natureCombobox = statusAndNatureComboboxes[1];

  if (statusCombobox.value !== 'none'){
    statusCombobox.classList.add("selected-status-or-nature");
  } 

  if (natureCombobox.value !== 'none'){
    natureCombobox.classList.add("selected-status-or-nature");
  } 
  
}

export async function retrieveFrontDefaultSprite(pokemon){
  let pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.toLowerCase()}`);
  let pokemonResponseJSON = await pokemonResponse.json();

  return pokemonResponseJSON["sprites"]["front_default"];
}

export async function retrieveEvolutionLine(location){
  let getEvolutionLineOfSelectedPokemon;

  let targetEncounterCombobox = document.querySelector(`.js-encounter-${location}`);
  let selectedPokemonInEncounterCombobox = targetEncounterCombobox.value;

  // Check if the pokemon's evolution line is stored
  for (let evolutionLine of activePokemonEvolutionLines){
    if (evolutionLine.includes(selectedPokemonInEncounterCombobox)){
      getEvolutionLineOfSelectedPokemon = evolutionLine;
    }
  }

  // If not, use PokeAPI

  if (!getEvolutionLineOfSelectedPokemon){
    getEvolutionLineOfSelectedPokemon = await getEvolutionLine(selectedPokemonInEncounterCombobox.toLowerCase());
  }

  return getEvolutionLineOfSelectedPokemon;
}

function searchForPokemonOrLocation(encounterRouteObjects){
  let getSearchInputValue = document.querySelector('.js-search-input').value.toLowerCase();

  let hasMatch = false;

  encounterRouteObjects.forEach(encounterRouteObject => {
    let locationLowerCase = encounterRouteObject.location.toLowerCase();
    let locationNoSpace = encounterRouteObject.location.split(' ').join('');

    let getSelectedPokemon = document.querySelector(`.js-encounter-${locationNoSpace}`).value.toLowerCase();

    if (locationLowerCase.includes(getSearchInputValue) || getSelectedPokemon.includes(getSearchInputValue)){
      document.querySelector(`.js-location-${locationNoSpace}-row`).style.display = "flex";
      hasMatch = true;
    } else{
      document.querySelector(`.js-location-${locationNoSpace}-row`).style.display = "none";
    }
  })

  if (!hasMatch){
    document.querySelector(`.js-center-box-container`).style.display = "none";
  } else{
    document.querySelector(`.js-center-box-container`).style.display = "flex";
  }


  // Use value of center box to set the value of the wrapper container
  let centerBoxHeight = document.querySelector('.js-center-box-container').offsetHeight;
  document.querySelector('.js-wrapper-for-center-box').setAttribute("style", `height:${centerBoxHeight}px`);

}

export async function fetchLocationDataFromApi(location_link){

  let gameVersion = localStorage.getItem('userDecision').toLowerCase().replace(" ", "");

  const fetcher = async function (location_link){
    const locationObjectFetch = await fetch(location_link);
    const locObj = await locationObjectFetch.json();
    
    return locObj;
  }

  let locationObject = await fetcher(location_link);
  
  // Get from PokeAPI encounter-condition-value
  const notConsideredEncounterConditions = ["swarm-yes", "radar-on", "slot2-firered", "slot2-ruby", "slot2-sapphire", "slot2-emerald", "slot2-firered", "slot2-leafgreen","radio-hoenn","radio-sinnoh"]

  const encounterMethods = ["walk", "old-rod", "good-rod", "super-rod", "surf", "rock-smash"];

  // Traverse each pokemon to determine if its "swarm", "gift", or not

  let availablePokemonAtLocationLink = [];

  const locationObjectPokemonEncounters = locationObject["pokemon_encounters"];

  for (const pokemonEncounter of locationObjectPokemonEncounters){
    let versionsAvailableOfPokemon = pokemonEncounter.version_details;
    let versionIndex;

    for (const version of versionsAvailableOfPokemon){
      if (version["version"]["name"] === gameVersion){

        // Get index of version name
        versionIndex = versionsAvailableOfPokemon.indexOf(version);
        break;
      }
    }

    if (versionIndex === undefined){
      continue;
    }

    // Version index should not be undefined
    if (pokemonEncounter["version_details"][versionIndex]["encounter_details"][0]["condition_values"].length === 0){
      if (encounterMethods.includes(pokemonEncounter["version_details"][0]["encounter_details"][0]["method"]["name"])){

        let current_pokemon = pokemonEncounter["pokemon"]["name"];

        if (!availablePokemonAtLocationLink.includes(current_pokemon)){
          availablePokemonAtLocationLink.push(current_pokemon);
        }
      } else{
        continue;
      }
      
    } else if (notConsideredEncounterConditions.includes(pokemonEncounter["version_details"][versionIndex]["encounter_details"][0]["condition_values"][0]["name"])){
      // Check the notConsideredEncounterConditions to understand what this else if block means
      // Bro that is unreadable..
      continue;
    } 
    else {
      let current_pokemon = pokemonEncounter["pokemon"]["name"];

      if (!availablePokemonAtLocationLink.includes(current_pokemon)){
        availablePokemonAtLocationLink.push(current_pokemon);
      }
    }
  }

  return availablePokemonAtLocationLink;
}

export function returnToMainScreen(){
  let headingPic = document.querySelector('.js-heading-pic');
  console.log(headingPic)

  headingPic.addEventListener("click", () => {
    window.location.href = '../../html/front-page.html';
    console.log("hei");
  });
  // localStorage.setItem('userDecision', userDecision);
}

export function removePopupUponSelectingAnEvolution(){
  // set .active to off
  document.querySelector(".js-popup-1").classList.remove("active");

  // Reset innerHTML everytime the popup window is closed
  document.querySelector(".js-popup-1").innerHTML = "";
}

export function addEventListenerToExitButton(){
  const popUpExitButton = document.querySelector('.js-close-btn');
    popUpExitButton.addEventListener('click', () => {
      removePopupUponSelectingAnEvolution();
    });
}