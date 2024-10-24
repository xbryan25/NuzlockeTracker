import getEvolutionLine from "./get-evolution-line.js";
import {activePokemonEvolutionLines, activePokemonInCombobox, activePokemonNoEvolutionLines} from "./active-data.js";

export async function displayDupe(pokemon, selectedRoute, selectedRouteTemplateString, encounterRoutes){

  console.log('--------------------------------start---------------------------')
  let activePokemonLocal = [];
  let activePokemonNoEvolutionLinesLocal = [];
  let activePokemonEvolutionLinesLocal = [];

  let tempActivePokemon = [];
  let tempPokemonNoEvolutionLinesLocal = [];
  let tempActivePokemonEvolutionLines = [];

  // To change the color of the selected select tag
  let currentSelect = document.querySelector(`.js-encounter-${selectedRoute}`);
  currentSelect.classList.add("selected-encounter");

  for (let encounterRoute of encounterRoutes){
    let encounterRouteNoSpace = (encounterRoute.location).split(' ').join('');
    let encounterRouteCombobox = document.querySelector(`.js-encounter-${encounterRouteNoSpace}`);

    let encounter = encounterRouteCombobox.value;

    if (encounter !== 'none' && !activePokemonInCombobox.includes(encounter)){
        let tempPokemonLowerCase = encounter.toLowerCase();
        let getEvolutionLineOfSelectedPokemon = await getEvolutionLine(tempPokemonLowerCase);

        getEvolutionLineOfSelectedPokemon.forEach(selectedPokemonTemp => {
          activePokemonLocal.push(selectedPokemonTemp);
          // activePokemonLocal.push(selectedPokemonTemp)
        });

        activePokemonEvolutionLinesLocal.push(getEvolutionLineOfSelectedPokemon);
        activePokemonNoEvolutionLinesLocal.push(encounter);
        
        let pokemonOptionsNodeLists = [];

        getEvolutionLineOfSelectedPokemon.forEach(selectedPokemon => {
          pokemonOptionsNodeLists.push(document.querySelectorAll(`.js-${selectedPokemon}-option`));
        });
        
        pokemonOptionsNodeLists.forEach(pokemonOptions => {
          pokemonOptions.forEach(pokemonOption => {
            pokemonOption.innerHTML = pokemonOption.value + ' - dupe'
            pokemonOption.value = pokemonOption.value + ' - dupe';

            pokemonOption.classList.add("dupe-option");
            pokemonOption.disabled = true;
          })
        })


        // ---- Make a temporary option string so that the selected pokemon won't have the dupe substring ----

        // let selectedRouteCombobox = document.querySelector(selectedRouteTemplateString);
        // let tempOptionTag = `<option value="${pokemon}" class="js-${selectedRoute}-encounter-display" selected disabled hidden>${pokemon}</option>`;

        // if (!selectedRouteCombobox.innerHTML.includes(tempOptionTag)){
        //   selectedRouteCombobox.innerHTML += tempOptionTag;
        // }

        let selectedRouteEncounterDisplay = document.querySelector(`.js-${selectedRoute}-encounter-display`);

        if (selectedRouteEncounterDisplay){
          selectedRouteEncounterDisplay.value = pokemon;
          selectedRouteEncounterDisplay.innerHTML = pokemon;
        } else{
          let selectedRouteCombobox = document.querySelector(selectedRouteTemplateString);
          selectedRouteCombobox.innerHTML += `<option value="${pokemon}" class="js-${selectedRoute}-encounter-display" selected disabled hidden>${pokemon}</option>`;
        }
        

    } else if (encounter !== 'none' && activePokemonInCombobox.includes(encounter) && !tempActivePokemon.includes(encounter)){

      let getEvolutionLineOfSelectedPokemon;

      for (let evolutionLine of activePokemonEvolutionLines){
        if (evolutionLine.includes(encounter)){
          getEvolutionLineOfSelectedPokemon = evolutionLine;
        }
      }

      // let getEvolutionLineOfSelectedPokemon = activePokemonEvolutionLines[activePokemonNoEvolutionLines.indexOf(encounter)]

      console.log("-----here-----")

      getEvolutionLineOfSelectedPokemon.forEach(selectedPokemonTemp => {
        if (!tempActivePokemon.includes(selectedPokemonTemp)){
          tempActivePokemon.push(selectedPokemonTemp);
        }
        // activePokemonLocal.push(selectedPokemonTemp)
      });

      tempActivePokemonEvolutionLines.push(getEvolutionLineOfSelectedPokemon);
      tempPokemonNoEvolutionLinesLocal.push(encounter);

      let selectedRouteEncounterDisplay = document.querySelector(`.js-${selectedRoute}-encounter-display`);

      if (selectedRouteEncounterDisplay){
        selectedRouteEncounterDisplay.value = pokemon;
        selectedRouteEncounterDisplay.innerHTML = pokemon;
      } else{
        let selectedRouteCombobox = document.querySelector(selectedRouteTemplateString);
        selectedRouteCombobox.innerHTML += `<option value="${pokemon}" class="js-${selectedRoute}-encounter-display" selected disabled hidden>${pokemon}</option>`;
      }


      // document.querySelector(selectedRouteTemplateString).innerHTML += `<option value="${pokemon}" class="js-${selectedRoute}-encounter-display" selected disabled hidden>${pokemon}</option>`;
      
    }
  }

  // Reset value of activePokemonInCombobox
  while (activePokemonInCombobox.length > 0) {
    activePokemonInCombobox.pop();
  }
  

  // console.log('temp');
  // console.log(tempActivePokemon);

  // console.log('local');
  // console.log(activePokemonLocal);

  for (let activePokemon of tempActivePokemon){
    activePokemonInCombobox.push(activePokemon);
  }

  for (let activePokemon of activePokemonLocal){
    activePokemonInCombobox.push(activePokemon);
  }

  // Reset value of activePokemonNoEvolutionLines
  while (activePokemonNoEvolutionLines.length > 0) {
    activePokemonNoEvolutionLines.pop();
  }

  for (let pokemon of tempPokemonNoEvolutionLinesLocal){
    activePokemonNoEvolutionLines.push(pokemon);
  }

  for (let pokemon of activePokemonNoEvolutionLinesLocal){;
    activePokemonNoEvolutionLines.push(pokemon);
  }

  // Reset value of activePokemonEvolutionLines
  while (activePokemonEvolutionLines.length > 0) {
    activePokemonEvolutionLines.pop();
  }

  for (let activePokemonEvolutionLine of tempActivePokemonEvolutionLines){;
    activePokemonEvolutionLines.push(activePokemonEvolutionLine);
  }

  for (let activePokemonEvolutionLine of activePokemonEvolutionLinesLocal){
    activePokemonEvolutionLines.push(activePokemonEvolutionLine);
  }

  // ---- To update the dupe substring ----

  // For the dynamic setting of the dupe title, traverse through all the encounter routes
  // Because if only the selected route is traversed, the " - dupe" substring will only
  // be removed in the selected route

  updateDupeSubstring(encounterRoutes);

  allDupeInRouteChecker(encounterRoutes);
}

export function updateDupeSubstring(encounterRoutes){
  for (let encounterRoute of encounterRoutes){
    let encounterRouteNoSpace = (encounterRoute.location).split(' ').join('');
    let encounterOptionsQuery = document.querySelectorAll(`.js-${encounterRouteNoSpace}-encounter-combobox-options`);

    encounterOptionsQuery.forEach(encounterOption => {
      let encounterOptionValue = encounterOption.value;

      if (encounterOptionValue.includes(" - dupe")){
        encounterOptionValue = encounterOptionValue.replace(' - dupe', '');
      }

      if (!activePokemonInCombobox.includes(encounterOptionValue)){
        encounterOption.innerHTML = encounterOption.innerHTML.replace(' - dupe', '');
        encounterOption.value = encounterOption.value.replace(' - dupe', '');
        encounterOption.disabled = false;
        encounterOption.classList.remove("dupe-option");
      }
    });

    allDupeInRouteChecker(encounterRoutes);
  }
}

function allDupeInRouteChecker(encounterRoutes){

  encounterRoutes.forEach(encounterRoute => {
    let encounterRouteNoSpace = (encounterRoute.location).split(' ').join('');

    let allOptions = document.querySelectorAll(`.js-${encounterRouteNoSpace}-encounter-combobox-options`);

    let allOptionsAreDupes = true;

    // If the an option in an encounterRoute is not in the activePokemonInCombobox,
    // it means that not all pokemon are dupes, therefore allOptionsAreNotDupes will be true

    for (let anOption of allOptions){
      let optionValue = anOption.value;

      if (optionValue.includes(' - dupe')){
        optionValue = optionValue.replace(' - dupe', '');
      }

      if (!activePokemonInCombobox.includes(optionValue)){
        allOptionsAreDupes = false;
        break;
      }
    }

    // If getLocationEncounterDisplay is active, then the combobox of the current location won't be disabled
    let getLocationEncounterDisplay = document.querySelector(`.js-${encounterRouteNoSpace}-encounter-display`);

    if (allOptionsAreDupes && !getLocationEncounterDisplay){
      let getLocationCombobox = document.querySelector(`.js-encounter-${encounterRouteNoSpace}`);
      getLocationCombobox.disabled = true;

      let getPlaceholderOption = getLocationCombobox.querySelector(`.js-${encounterRouteNoSpace}-placeholder`);
      getPlaceholderOption.innerHTML = "--- All dupes ---";
    } else{
      let getLocationCombobox = document.querySelector(`.js-encounter-${encounterRouteNoSpace}`);
      getLocationCombobox.disabled = false;

      let getPlaceholderOption = getLocationCombobox.querySelector(`.js-${encounterRouteNoSpace}-placeholder`);
      getPlaceholderOption.innerHTML = "Find encounter";
    }
  })
}