// TODO: BRANCHED EVOLUTIONS
// TODO: GET PICTURE OF THE POKEMON IN POP UP WINDOW

async function fetchData(){
  try{
    let userDecision = localStorage.getItem('userDecision');
    
    userDecision = userDecision.replace(" ", "_");
    userDecision = userDecision.toLowerCase();

    const response = await fetch(`../locations-in-json/${userDecision}_locations.json`);

    // Data is an array of location objects from the local .json file
    const data = await response.json();

    loadHTML(data, userDecision);
  } catch(error){
    console.error(error);
  }
}

async function getPokemonEncountersAtEachLocation(location){
  try{
    if ('type' in location && location['type'] === 'gift'){


      return location['gift_pokemon'];
    } else{

      let availablePokemonArrays = [];
      let availablePokemon = [];
      let location_links = [];

      const promises = [];

      // Get each sublocation; can be shortened

      location["location-links"].forEach(location_link => location_links.push(location_link));

      // Traverse through each sublocation...
      for (const location_link of location_links){
        // ... to fetch the data of each sublocation.
        // const locationObjectFetch = await fetch(location_link);

        // const locationObject = await locationObjectFetch.json();
        // promises.push(fetchLocationDataFromApi(location_link));
        promises.push(fetchLocationDataFromApi(location_link));
        
      }

      availablePokemonArrays = await Promise.all(promises);
      // console.log("---test---")
      // console.log(availablePokemonArrays)

      availablePokemonArrays.forEach(availablePokemonArray => {
        availablePokemonArray.forEach(pokemon => {
          let pokemonTitleCase = pokemon.charAt(0).toUpperCase() + pokemon.slice(1);

          if (!availablePokemon.includes(pokemonTitleCase)){
            // console.log(availablePokemon)
            availablePokemon.push(pokemonTitleCase);
          }
        });
      });

      return availablePokemon;
    }

  } catch(error){
    console.error(error);
  }
}

async function fetchLocationDataFromApi(location_link){

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

    

  //   } else if (pokemonEncounter["version_details"].length === 1){
  //     if (pokemonEncounter["version_details"][0]["encounter_details"][0]["condition_values"].length === 0){

  //       if (encounterMethods.includes(pokemonEncounter["version_details"][0]["encounter_details"][0]["method"]["name"])){

  //         let current_pokemon = pokemonEncounter["pokemon"]["name"];

  //         if (!availablePokemonAtLocationLink.includes(current_pokemon)){
  //           availablePokemonAtLocationLink.push(current_pokemon);
  //         }
  //       } else{
  //         continue;
  //       }
         
  //     } else if (notConsideredEncounterConditions.includes(pokemonEncounter["version_details"][0]["encounter_details"][0]["condition_values"][0]["name"])){
  //       continue;
  //     } else {
  //       let current_pokemon = pokemonEncounter["pokemon"]["name"];

  //       if (!availablePokemonAtLocationLink.includes(current_pokemon)){
  //         availablePokemonAtLocationLink.push(current_pokemon);
  //       }
  //     }
  //   }
  // }

  // for (const pokemonEncounter of locationObjectPokemonEncounters){
  //   // This means pokemon is present in Diamond, Pearl, and Platinum
  //   // In this case, we get the last element
  //   if (pokemonEncounter["version_details"].length === 3){
  //     // Mali ni
  //     if (pokemonEncounter["version_details"][2]["encounter_details"][0]["condition_values"].length === 0){

  //       if (encounterMethods.includes(pokemonEncounter["version_details"][0]["encounter_details"][0]["method"]["name"])){

  //         let current_pokemon = pokemonEncounter["pokemon"]["name"];

  //         if (!availablePokemonAtLocationLink.includes(current_pokemon)){
  //           availablePokemonAtLocationLink.push(current_pokemon);
  //         }
  //       } else{
  //         continue;
  //       }
         
  //     } else if (notConsideredEncounterConditions.includes(pokemonEncounter["version_details"][2]["encounter_details"][0]["condition_values"][0]["name"])){
  //       // Bro that is unreadable..
  //       continue;
  //     } else {
  //       let current_pokemon = pokemonEncounter["pokemon"]["name"];

  //       if (!availablePokemonAtLocationLink.includes(current_pokemon)){
  //         availablePokemonAtLocationLink.push(current_pokemon);
  //       }
  //     }

  //   } else if (pokemonEncounter["version_details"].length === 1){
  //     if (pokemonEncounter["version_details"][0]["encounter_details"][0]["condition_values"].length === 0){

  //       if (encounterMethods.includes(pokemonEncounter["version_details"][0]["encounter_details"][0]["method"]["name"])){

  //         let current_pokemon = pokemonEncounter["pokemon"]["name"];

  //         if (!availablePokemonAtLocationLink.includes(current_pokemon)){
  //           availablePokemonAtLocationLink.push(current_pokemon);
  //         }
  //       } else{
  //         continue;
  //       }
         
  //     } else if (notConsideredEncounterConditions.includes(pokemonEncounter["version_details"][0]["encounter_details"][0]["condition_values"][0]["name"])){
  //       continue;
  //     } else {
  //       let current_pokemon = pokemonEncounter["pokemon"]["name"];

  //       if (!availablePokemonAtLocationLink.includes(current_pokemon)){
  //         availablePokemonAtLocationLink.push(current_pokemon);
  //       }
  //     }
  //   }
  // }

  return availablePokemonAtLocationLink;
}

function activateLoadingScreen(){
  let centerBox = document.querySelector('.js-center-box-container');

  centerBox.innerHTML += '<div class="loader js-loader"></div>';
  centerBox.setAttribute("style", `height:${225}px`);
}

async function loadHTML(dataFromJSON){
  activateLoadingScreen();

  let userDecision = localStorage.getItem('userDecision');
  let userDecisionForPic = userDecision.replace(" ", "_");
  let userDecisionTitle = userDecision.charAt(0).toUpperCase() + userDecision.slice(1);

  console.log(userDecision);

  document.querySelector('.js-header-div-container').innerHTML = `<div class="js-heading-pic header-div-pic"></div>
                                                        <div class="js-header-div-game-title header-div-game-title"></div>

                                                        <button class="js-clear-all-encounters-button clear-all-encounters-button">Clear all encounters</button>
                                                        
                                                        <input type="text" placeholder="Search..." class="search-input js-search-input">
                                                        
                                                        <div class="js-change-day-night-look change-day-night-look">☀</div>`
                                                        
                                                        ;



  document.querySelector('.js-heading-pic').innerHTML = `<img src="../../images/front-page/${userDecisionForPic}.png" height="50px">`;
  document.querySelector('.js-header-div-game-title').innerHTML = `${userDecisionTitle} Nuzlocke`;


  // add event listener to picture
  returnToMainScreen();

  let encounterRouteObjects = [];

  for (let locationObject of dataFromJSON){
    encounterRouteObjects.push(locationObject);
  }

  let entireHTML = '';

  for (let encounterRouteObject of encounterRouteObjects){
    let optionsHTML = await availablePokemonHTMLCreator(encounterRouteObject);
    let location = encounterRouteObject.location;
    let locationNoSpace = location.split(' ').join('');

    entireHTML += `<div class="location-row js-location-${locationNoSpace}-row js-location-row">
                    <p class="location-text js-location-${locationNoSpace}">${location}</p>
                    <select name="${locationNoSpace}" class="js-encounter-${locationNoSpace} encounter-combobox js-encounter-active">
                      ${optionsHTML}
                    </select>

                    <input type="text" placeholder="Input nickname" class="input-nickname js-${locationNoSpace}-nickname">

                    ${statusHTMLCreator(locationNoSpace)}

                    ${naturesHTMLCreator(locationNoSpace)}

                    ${clearEncounterHTMLCreator(locationNoSpace)}

                    <button class="death-button js-death-${locationNoSpace}-button" title="Kill encounter">🕱</button>
                    <button class="death-button js-evolve-${locationNoSpace}-button" title="Evolve encounter">▲</button>
                </div>`;
  }

  // Remove the loading screen when the html is about to be added
  
  document.querySelector('.js-loader').remove();

  document.querySelector('.js-center-box-container').setAttribute("style", `height:auto`);

  document.querySelector('.js-center-box-container')
      .innerHTML = entireHTML;

  encounterRouteObjects.forEach(async encounterRouteObject => {
    let locationNoSpace = (encounterRouteObject.location).split(' ').join('');

    let locationClass = `.js-encounter-${locationNoSpace}`;
    let locationClearEncounterButton = `.js-clear-encounter-${locationNoSpace}`;
    let locationStatusAndNature = `.js-${locationNoSpace}-status-and-nature-combobox`;

    let killButton = `.js-death-${locationNoSpace}-button`;
    let evolveButton = `.js-evolve-${locationNoSpace}-button`;
    

    document.querySelector(locationClass).addEventListener("change", event => {
      removeEncounterDisplays(locationNoSpace);
      displayDupe(event.target.value, locationNoSpace, locationClass, encounterRouteObjects)
    });

    document.querySelector(locationClass).addEventListener("change", async event => {
      showKillPokemonButton(locationNoSpace);
      
      showEvolvePokemonButton(locationNoSpace);
    });

    // document.querySelector(locationClass).addEventListener("change", event => showKillPokemonButton(locationNoSpace));

    document.querySelector(locationClearEncounterButton).addEventListener("click", event => clearEncounter(locationNoSpace, encounterRouteObjects));

    document.querySelector(killButton).addEventListener("click", event => changeStatusToDead(locationNoSpace));
    document.querySelector(evolveButton).addEventListener("click", await evolvePokemon(locationNoSpace));

    document.querySelectorAll(locationStatusAndNature).forEach(element => {
      element.addEventListener("change", event => activeStatusOrNature(locationNoSpace));
      element.addEventListener("change", async event => {
        showKillPokemonButton(locationNoSpace);
        showEvolvePokemonButton(locationNoSpace);
      });

    });
    
    document.querySelector(evolveButton).addEventListener('click', () => {
      // set .active to on
      document.querySelector(".js-popup-1").classList.add("active");
      console.log(document.querySelector(".js-popup-1").innerHTML);
    });
  });


  document.querySelector('.js-search-input').addEventListener("input", event => searchForPokemonOrLocation(encounterRouteObjects));

  document.querySelector(`.js-clear-all-encounters-button`).addEventListener("click", event => clearAllEncounters(encounterRouteObjects));

  document.querySelector('.js-change-day-night-look').addEventListener("click", event => changeDayNightLook(encounterRouteObjects));

}

function removeEncounterDisplays(location){
  let encounterDisplaysQuery = document.querySelectorAll(`.js-${location}-encounter-display`);

  encounterDisplaysQuery.forEach(encounterDisplay => {
    encounterDisplay.remove();
  })
}

async function displayDupe(pokemon, selectedRoute, selectedRouteTemplateString, encounterRoutes){

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
  activePokemonInCombobox = [];

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
  activePokemonNoEvolutionLines = [];

  for (let pokemon of tempPokemonNoEvolutionLinesLocal){
    activePokemonNoEvolutionLines.push(pokemon);
  }

  for (let pokemon of activePokemonNoEvolutionLinesLocal){;
    activePokemonNoEvolutionLines.push(pokemon);
  }

  // Reset value of activePokemonEvolutionLines
  activePokemonEvolutionLines = [];

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

function updateDupeSubstring(encounterRoutes){
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

async function getSelectedPokemon(encounterRoutes){
  let activePokemonList = [];
  let activeArrays = [];
  const promises = [];

  encounterRoutes.forEach(encounterRoute => {
    promises.push(getSelectedPokemonAtRoute(encounterRoute));
  });

  activeArrays = await Promise.all(promises);

  activeArrays = activeArrays.filter(element => {
    return element !== undefined;
  })

  activeArrays.forEach(elementArray => {
    elementArray.forEach(pokemon => {
      if (!activePokemonList.includes(pokemon)){
        activePokemonList.push(pokemon);
      }
    });
  });


  return activePokemonList;
  
}

async function getSelectedPokemonAtRoute(encounterRoute){
  let encounterRouteNoSpace = (encounterRoute.location).split(' ').join('');

  // Get the active value of each comboboxes
  let encounterRouteSelect = document.querySelector(`.js-encounter-${encounterRouteNoSpace}`);
  let selectedPokemonInRoute = encounterRouteSelect.value;

  if (selectedPokemonInRoute !== 'none'){
    let selectedPokemonInRouteTitleCase = selectedPokemonInRoute.charAt(0).toLowerCase() + selectedPokemonInRoute.slice(1);
    let getEvolutionLineSelected = await getEvolutionLine(selectedPokemonInRouteTitleCase);
    
    // TODO: Update the activePokemonSelected

    return getEvolutionLineSelected;
  } 
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

async function availablePokemonHTMLCreator(locationObject){
  let locationNoSpace = locationObject.location.split(' ').join('');

  let availablePokemon = await getPokemonEncountersAtEachLocation(locationObject);

  let availablePokemonHTML = `<option value="none" class="js-${locationNoSpace}-placeholder"selected disabled hidden>Find encounter</option>`;

  availablePokemon.forEach((pokemon) => {
    availablePokemonHTML += `<option value="${pokemon}" class="encounter-combobox-options js-${pokemon}-option js-${locationNoSpace}-encounter-combobox-options" data-img-width="16px">${pokemon}</option>`
  });

  return availablePokemonHTML;
}

function statusHTMLCreator(location){

  return `<select name="Status" class="status-and-natures-combobox js-${location}-status-and-nature-combobox">
            <option value="none" selected disabled hidden>Status</option>
            <option value="Captured">Captured</option>
            <option value="Dead">Dead</option>
            <option value="Missed">Missed</option>
            <option value="Received">Received</option>
          </select>`;
}

function naturesHTMLCreator(location){
  let naturesHTMLOptions = ''

  let natures = ["Adamant", "Bashful", "Bold", "Brave", "Calm", "Careful", "Docile", "Gentle",
                  "Hardy", "Hasty", "Impish", "Jolly", "Lax", "Lonely", "Mild", "Modest", "Naive",
                  "Naughty", "Quiet", "Quirky", "Rash", "Relaxed", "Sassy", "Serious", "Timid"]

  natures.forEach(nature => {
    naturesHTMLOptions += `<option value="${nature}">${nature}</option>`
  }) 


  return `<select name="Natures" class="status-and-natures-combobox js-${location}-status-and-nature-combobox">
            <option value="none" selected disabled hidden>Nature</option>
            ${naturesHTMLOptions}
          </select>`;
}

function clearEncounterHTMLCreator(location){
  return `<button class="clear-encounter-button js-clear-encounter-${location}" title="Clear encounter"><div class="clear-encounter-button-text">✖</div></button>`;

}

async function clearEncounter(location, encounterRouteObjects){
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

function clearAllEncounters(encounterRouteObjects){

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

function activeStatusOrNature(location){
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

function showKillPokemonButton(location){
  let targetStatusCombobox = document.querySelectorAll(`.js-${location}-status-and-nature-combobox`)[0];
  let targetEncounterCombobox = document.querySelector(`.js-encounter-${location}`);

  if (targetStatusCombobox.value === "Captured" && targetEncounterCombobox.value !== "none"){
    document.querySelector(`.js-death-${location}-button`).style.display = "flex";
  }
}

async function showEvolvePokemonButton(location){
  let evolveButton = document.querySelector(`.js-evolve-${location}-button`);

  let selectedPokemonInEncounterCombobox = document.querySelector(`.js-encounter-${location}`).value;

  let getEvolutionLineOfSelectedPokemon = await retrieveEvolutionLine(location);

  let selectedPokemonIndex = getEvolutionLineOfSelectedPokemon.indexOf(selectedPokemonInEncounterCombobox);

  let targetStatusCombobox = document.querySelectorAll(`.js-${location}-status-and-nature-combobox`)[0];
  let targetEncounterCombobox = document.querySelector(`.js-encounter-${location}`);

  // For the last condition, if the selectedPokemonIndex is less than the length of the evolution line, it must mean that
  // the selected pokemon can still evolve


  if (targetStatusCombobox.value === "Captured" && targetEncounterCombobox.value !== "none" && selectedPokemonIndex < getEvolutionLineOfSelectedPokemon.length - 1){
    evolveButton.style.display = "flex";
    

  } else{
    evolveButton.style.display = "none";
  }
}

async function evolvePokemon(location){
  // This function returns a function, this is because it will be added to an eventListener

  return async function (){
    let targetEncounterCombobox = document.querySelector(`.js-encounter-${location}`);
    let currentPokemonInCombobox = targetEncounterCombobox.value;

    let evolutionLine = await retrieveEvolutionLine(location);

    let isBranchedEvolution = false;

    // Modify the function variable
    // evolveHandler = function(){
    //   evolvePokemon(targetEncounterCombobox.value, evolutionLine, location, evolveHandler);
    // }

    // TODO: Put in a JSON file later; about pokemon with branched evolution lines

    // TODO: Make a pop up tab if branched evolution
    let branchedEvolutionLines = [["Oddish", "Gloom", "Vileplume", "Bellossom"],
                                ["Poliwag", "Poliwhirl", "Poliwrath", "Politoed"],
                                ["Slowpoke", "Slowbro", "Slowking"],
                                ["Eevee", "Vaporeon", "Jolteon", "Flareon", "Espeon", "Umbreon", "Leafeon", "Glaceon", "Sylveon"],
                                ["Tyrogue", "Hitmonlee", "Hitmonchan", "Hitmontop"],
                                ["Wurmple", "Silcoon", "Cascoon", "Beautifly", "Dustox"],
                                ["Ralts", "Kirlia", "Gardevoir", "Gallade"],
                                ["Nincada", "Ninjask", "Shedinja"],
                                ["Snorunt", "Glalie", "Froslass"],
                                ["Clamperl", "Huntail", "Gorebyss"]]

    for (let branchedEvolutionLine in branchedEvolutionLines){
      if (branchedEvolutionLines[branchedEvolutionLine].includes(currentPokemonInCombobox)){
        isBranchedEvolution = true;
        break;
      }
    }    


    // This means that an evolution still exists
    if (evolutionLine[evolutionLine.indexOf(currentPokemonInCombobox) + 1] && !isBranchedEvolution){
      let evolutionOfCurrentPokemon = evolutionLine[evolutionLine.indexOf(currentPokemonInCombobox) + 1];

      let pokemonPicLink = await retrieveFrontDefaultSprite(currentPokemonInCombobox);
      let pokemonNextEvoPicLink = await retrieveFrontDefaultSprite(evolutionOfCurrentPokemon)

      document.querySelector(".js-popup-1").innerHTML = `<div class="overlay"></div>
			<div class="content">
				<div class="close-btn js-close-btn">&times;</div>
				<h1 class="content-h1">Evolve ${currentPokemonInCombobox}?</h1>

				<div class="popup-img-container">
					<img src="${pokemonPicLink}" title="${currentPokemonInCombobox}"height="110px">
          <img src="${pokemonNextEvoPicLink}" title="Evolve ${currentPokemonInCombobox} into ${evolutionOfCurrentPokemon}" height="110px">
				</div>
				
			</div>`;

      // document.querySelector(".js-popup-1").classList.remove("active");

      // For the exit button of the popup screen

      const popUpExitButton = document.querySelector('.js-close-btn');
      popUpExitButton.addEventListener('click', () => {
        // set .active to off
        document.querySelector(".js-popup-1").classList.remove("active");
      });

      targetEncounterCombobox.innerHTML += `<option value="${evolutionOfCurrentPokemon}" class="js-${location}-encounter-display" selected disabled hidden>${evolutionOfCurrentPokemon}</option>`;

      // Update the eventListener's parameters
      // document.querySelector(evolveButton).removeEventListener("click", evolveHandler);

      targetEncounterCombobox.value = evolutionOfCurrentPokemon;

      if (!evolutionLine[evolutionLine.indexOf(targetEncounterCombobox.value) + 1]){
        document.querySelector(`.js-evolve-${location}-button`).style.display = "none";
      }

      // document.querySelector(evolveButton).addEventListener("click", evolveHandler);

      // document.querySelector(evolveButton).addEventListener("click", event => evolvePokemon(targetEncounterCombobox.value, evolutionLine, location));
    } else if (evolutionLine[evolutionLine.indexOf(currentPokemonInCombobox) + 1] && isBranchedEvolution){
      alert("Part of branched evolution");
    }
    
    // else if (!evolutionLine[evolutionLine.indexOf(currentPokemonInCombobox) + 1]){
    //   document.querySelector(`.js-evolve-${location}-button`).style.display = "none";
    // }
  };
}

async function retrieveFrontDefaultSprite(pokemon){
  let pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.toLowerCase()}`);
  let pokemonResponseJSON = await pokemonResponse.json();

  return pokemonResponseJSON["sprites"]["front_default"];
}

async function retrieveEvolutionLine(location){
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

function changeStatusToDead(location){
  document.querySelectorAll(`.js-${location}-status-and-nature-combobox`)[0].value = "Dead";
}

function changeDayNightLook(encounterRouteObjects){
  let dayNightLookIcon = document.querySelector('.js-change-day-night-look');

  if (dayNightLookIcon.innerHTML === "☀"){
    dayNightLookIcon.innerHTML = "☾";

    dayNightLookIcon.style.color = "black";

    document.querySelector('.js-header-div-container').style.backgroundColor = "#dcdddc";

    document.querySelector('.js-header-div-game-title').style.color = "#535454";

    document.querySelector('.js-clear-all-encounters-button').style.color = "#535454";
    document.querySelector('.js-clear-all-encounters-button').style.backgroundColor = "#dcdddc";
    document.querySelector('.js-clear-all-encounters-button').style.borderColor = "black";

    // TODO: Change placeholder text; add a css class
    document.querySelector('.js-search-input').style.color = "#535454";
    document.querySelector('.js-search-input').style.backgroundColor = "#dcdddc";
    document.querySelector('.js-search-input').style.borderColor = "black";
    document.querySelector(`.js-search-input`).classList.add("day-search-input");

    document.querySelector('.js-body-background').style.backgroundColor = "#c4c6c4";

    document.querySelector('.js-footer-div-container').style.backgroundColor = "#dcdddc";
    document.querySelector('.js-footer-div-contents').style.color = "#535454";
    document.querySelector('.js-footer-page-link').style.color = "#535454";

    document.querySelector('.js-center-box-container').style.backgroundColor = "#b6b8b6";

    encounterRouteObjects.forEach(encounterRouteObject => {
      let locationNoSpace = encounterRouteObject.location.split(' ').join('');

      document.querySelector(`.js-location-${locationNoSpace}`).style.color = 'black';

      document.querySelector(`.js-encounter-${locationNoSpace}`).style.borderColor = 'black'; 
      document.querySelector(`.js-encounter-${locationNoSpace}`).style.backgroundColor = 'rgb(182, 184, 182)'; 
      document.querySelector(`.js-encounter-${locationNoSpace}`).style.color = 'black'; 

      document.querySelector(`.js-${locationNoSpace}-nickname`).style.borderColor = 'black';
      document.querySelector(`.js-${locationNoSpace}-nickname`).style.backgroundColor = 'rgb(182, 184, 182)';
      document.querySelector(`.js-${locationNoSpace}-nickname`).style.color = 'black'; 
      document.querySelector(`.js-${locationNoSpace}-nickname`).classList.add("day-input-nickname");

      document.querySelectorAll(`.js-${locationNoSpace}-status-and-nature-combobox`).forEach(element => {
        element.style.borderColor = 'black';
        element.style.backgroundColor = 'rgb(182, 184, 182)';
        element.style.color = 'black';
      })

      document.querySelector(`.js-clear-encounter-${locationNoSpace}`).style.borderColor = 'black';
      document.querySelector(`.js-clear-encounter-${locationNoSpace}`).style.backgroundColor = 'rgb(182, 184, 182)'; 
      document.querySelector(`.js-clear-encounter-${locationNoSpace}`).style.color = 'black'; 
    });

  } else{
    dayNightLookIcon.innerHTML = "☀";

    dayNightLookIcon.style.color = "white";

    // document.querySelector('.js-header-div-container').style.backgroundColor = "rgb(74, 72, 72)";
    document.querySelector('.js-header-div-container').style.removeProperty('background-color');

    // document.querySelector('.js-header-div-game-title').style.color = "#535454";
    document.querySelector('.js-header-div-game-title').style.removeProperty('color');

    document.querySelector('.js-clear-all-encounters-button').style.removeProperty('color');
    document.querySelector('.js-clear-all-encounters-button').style.removeProperty('background-color');
    document.querySelector('.js-clear-all-encounters-button').style.removeProperty('border-color');

    document.querySelector('.js-search-input').style.removeProperty('color');
    document.querySelector('.js-search-input').style.removeProperty('background-color');
    document.querySelector('.js-search-input').style.removeProperty('border-color');
    document.querySelector(`.js-search-input`).classList.remove("day-search-input");

    document.querySelector('.js-body-background').style.removeProperty('background-color');

    document.querySelector('.js-footer-div-container').style.removeProperty('background-color');
    document.querySelector('.js-footer-div-contents').style.removeProperty('color');
    document.querySelector('.js-footer-page-link').style.removeProperty('color');

    document.querySelector('.js-center-box-container').style.removeProperty('background-color');

    encounterRouteObjects.forEach(encounterRouteObject => {
      let locationNoSpace = encounterRouteObject.location.split(' ').join('');

      document.querySelector(`.js-location-${locationNoSpace}`).style.removeProperty('color');

      document.querySelector(`.js-encounter-${locationNoSpace}`).style.removeProperty('border-color'); 
      document.querySelector(`.js-encounter-${locationNoSpace}`).style.removeProperty('background-color'); 
      document.querySelector(`.js-encounter-${locationNoSpace}`).style.removeProperty('color'); 

      document.querySelector(`.js-${locationNoSpace}-nickname`).style.removeProperty('border-color');
      document.querySelector(`.js-${locationNoSpace}-nickname`).style.removeProperty('background-color');
      document.querySelector(`.js-${locationNoSpace}-nickname`).style.removeProperty('color'); 
      document.querySelector(`.js-${locationNoSpace}-nickname`).classList.remove("day-input-nickname");

      document.querySelectorAll(`.js-${locationNoSpace}-status-and-nature-combobox`).forEach(element => {
        element.style.removeProperty('border-color');
        element.style.removeProperty('background-color');
        element.style.removeProperty('color');
      })

      document.querySelector(`.js-clear-encounter-${locationNoSpace}`).style.removeProperty('border-color');
      document.querySelector(`.js-clear-encounter-${locationNoSpace}`).style.removeProperty('background-color'); 
      document.querySelector(`.js-clear-encounter-${locationNoSpace}`).style.removeProperty('color'); 
    });
  }
}

function returnToMainScreen(){
  let headingPic = document.querySelector('.js-heading-pic');
  console.log(headingPic)

  headingPic.addEventListener("click", () => {
    window.location.href = '../../html/front-page.html';
    console.log("hei");
  });
  // localStorage.setItem('userDecision', userDecision);
}


fetchData();

let activePokemonEvolutionLines = [];
let activePokemonInCombobox = [];
let activePokemonNoEvolutionLines = [];


// let searchInputString = [];

// getPokemonEncountersAtEachLocation({
//   "location": "Lake Verity",
//   "location-links": ["https://pokeapi.co/api/v2/location-area/135/",
//                       "https://pokeapi.co/api/v2/location-area/136/"]
// });

// getPokemonEncountersAtEachLocation({
//   "location": "Route 201",
//   "location-links": ["https://pokeapi.co/api/v2/location-area/141/"]

// });

// fetch("../scripts/track/test.json")
//   .then(response => {
//     response.json();
//   }).then(data =>  {console.log(data); console.log('done')});




// fetch('./platinum_locations.json').then(response => {response.json()}).then(data => console.log(data));
//144 is the limit for encounters in Platinum

// fetch("https://pokeapi.co/api/v2/location-area/?limit=144").then(response => response.json().then(data => console.log(data))).catch(error => console.error(error()));

// for locations in emerald "...location-area?limit=144&offset=305"