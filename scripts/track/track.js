
// Kraazy, async/await raman diay gamiton instead nga solo fetch
async function fetchData(){
  try{
    const response = await fetch("../locations-in-json/platinum_locations.json");

    // Data is an array of location objects from the local .json file
    const data = await response.json();

    loadHTML(data);
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
    // This means pokemon is present in Diamond, Pearl, and Platinum
    // In this case, we get the last element
    if (pokemonEncounter["version_details"].length === 3){
      // Mali ni
      if (pokemonEncounter["version_details"][2]["encounter_details"][0]["condition_values"].length === 0){

        if (encounterMethods.includes(pokemonEncounter["version_details"][0]["encounter_details"][0]["method"]["name"])){

          let current_pokemon = pokemonEncounter["pokemon"]["name"];

          if (!availablePokemonAtLocationLink.includes(current_pokemon)){
            availablePokemonAtLocationLink.push(current_pokemon);
          }
        } else{
          continue;
        }
         
      } else if (notConsideredEncounterConditions.includes(pokemonEncounter["version_details"][2]["encounter_details"][0]["condition_values"][0]["name"])){
        // Bro that is unreadable..
        continue;
      } else {
        let current_pokemon = pokemonEncounter["pokemon"]["name"];

        if (!availablePokemonAtLocationLink.includes(current_pokemon)){
          availablePokemonAtLocationLink.push(current_pokemon);
        }
      }

    } else if (pokemonEncounter["version_details"].length === 1){
      if (pokemonEncounter["version_details"][0]["encounter_details"][0]["condition_values"].length === 0){

        if (encounterMethods.includes(pokemonEncounter["version_details"][0]["encounter_details"][0]["method"]["name"])){

          let current_pokemon = pokemonEncounter["pokemon"]["name"];

          if (!availablePokemonAtLocationLink.includes(current_pokemon)){
            availablePokemonAtLocationLink.push(current_pokemon);
          }
        } else{
          continue;
        }
         
      } else if (notConsideredEncounterConditions.includes(pokemonEncounter["version_details"][0]["encounter_details"][0]["condition_values"][0]["name"])){
        continue;
      } else {
        let current_pokemon = pokemonEncounter["pokemon"]["name"];

        if (!availablePokemonAtLocationLink.includes(current_pokemon)){
          availablePokemonAtLocationLink.push(current_pokemon);
        }
      }
    }
  }

  return availablePokemonAtLocationLink;
}

async function loadHTML(dataFromJSON){
  let userDecision = localStorage.getItem('userDecision');
  let userDecisionTitle = userDecision.charAt(0).toUpperCase() + userDecision.slice(1);

  console.log(userDecision);

  document.querySelector('.js-header-div-container').innerHTML = `<div class="js-heading-pic header-div-pic"></div>
                                                        <div class="js-header-div-game-title header-div-game-title"></div> `;

  document.querySelector('.js-heading-pic').innerHTML = `<img src="../../images/front-page/${userDecision}.png" height="50px">`;
  document.querySelector('.js-header-div-game-title').innerHTML = `${userDecisionTitle} Nuzlocke`;

  let encounterRoutes = [];

  for (let locationObject of dataFromJSON){
    encounterRoutes.push(locationObject);
  }

  let entireHTML = '';

  for (let encounterRoute of encounterRoutes){
    let optionsHTML = await availablePokemonHTMLCreator(encounterRoute);

    entireHTML += `<div class="location-row js-location-row">
                    <p class="location-text">${encounterRoute.location}</p>
                    <select name="${encounterRoute.location}" class="js-encounter-${(encounterRoute.location).split(' ').join('')} every-combobox js-encounter-active">
                      ${optionsHTML}
                    </select>

                    <input type="text" placeholder="Input nickname" class="input-nickname">

                    ${statusHTMLCreator()}

                    ${naturesHTMLCreator()}
                </div>`;
  }

  document.querySelector('.js-center-box-container')
      .innerHTML = entireHTML;

  

  encounterRoutes.forEach(encounterRoute => {
    let encounterRouteNoSpace = (encounterRoute.location).split(' ').join('');
    let encounterRouteClass = `.js-encounter-${encounterRouteNoSpace}`;

    document.querySelector(encounterRouteClass).addEventListener("change", event => displayDupe(event.target.value, encounterRouteNoSpace, encounterRouteClass, encounterRoutes));
  })

}

async function displayDupe(pokemon, selectedRoute, selectedRouteTemplateString, encounterRoutes){
  let activePokemonLocal = [];
  let activePokemonEvolutionLinesLocal = [];

  let tempActivePokemon = [];
  let tempActivePokemonEvolutionLines = [];

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
        
        let pokemonOptionsNodeLists = [];

        getEvolutionLineOfSelectedPokemon.forEach(selectedPokemon => {
          pokemonOptionsNodeLists.push(document.querySelectorAll(`.js-${selectedPokemon}-option`));
        });

        
        pokemonOptionsNodeLists.forEach(pokemonOptions => {
          pokemonOptions.forEach(pokemonOption => {
            pokemonOption.innerHTML = pokemonOption.value + ' - dupe'
          })
        })

        // ---- Make a temporary option string so that the selected pokemon won't have the dupe substring ----

        document.querySelector(selectedRouteTemplateString).innerHTML += `<option value="${pokemon}" class="js-${selectedRoute}-encounter-display" selected disabled hidden>${pokemon}</option>`;

    } else if (encounter !== 'none' && activePokemonInCombobox.includes(encounter)){
      let getEvolutionLineOfSelectedPokemon = activePokemonEvolutionLines[activePokemonInCombobox.indexOf(encounter)]

      getEvolutionLineOfSelectedPokemon.forEach(selectedPokemonTemp => {
        tempActivePokemon.push(selectedPokemonTemp);
        // activePokemonLocal.push(selectedPokemonTemp)
      });

      tempActivePokemonEvolutionLines.push(getEvolutionLineOfSelectedPokemon);
    }


    // Reset value of activePokemonInCombobox
    activePokemonInCombobox = [];

    for (let activePokemon of tempActivePokemon){
      activePokemonInCombobox.push(activePokemon);
    }

    for (let activePokemon of activePokemonLocal){
      activePokemonInCombobox.push(activePokemon);
    }

    // Reset value of activePokemonEvolutionLines
    activePokemonEvolutionLines = [];

    for (let activePokemonEvolutionLine of tempActivePokemonEvolutionLines){;
      activePokemonEvolutionLines.push(activePokemonEvolutionLine);
    }

    for (let activePokemonEvolutionLine of activePokemonEvolutionLinesLocal){
      activePokemonEvolutionLines.push(activePokemonEvolutionLine);
    }
  }

  // ---- For the display temporary option when a pokemon is selected ----

  let encounterDisplaysQuery = document.querySelectorAll(`.js-${selectedRoute}-encounter-display`);

  encounterDisplaysQuery.forEach(encounterDisplay => {
    if (encounterDisplay.textContent !== `${pokemon}`){
      encounterDisplay.remove();
    }
  });


  // ---- To update the dupe substring ----

  // For the dynamic setting of the dupe title, traverse through all the encounter routes
  // Because if only the selected route is traversed, the " - dupe" substring will only
  // be removed in the selected route

  for (let encounterRoute of encounterRoutes){
    let encounterRouteNoSpace = (encounterRoute.location).split(' ').join('');
    let encounterOptionsQuery = document.querySelectorAll(`.js-${encounterRouteNoSpace}-encounter-combobox-options`);

    encounterOptionsQuery.forEach(encounterOption => {

      if (!activePokemonInCombobox.includes(encounterOption.value)){
        encounterOption.innerHTML = encounterOption.innerHTML.replace(' - dupe', '');
      }
    });
  }
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

  let availablePokemonHTML = '<option value="none" selected disabled hidden>Find encounter</option>';

  availablePokemon.forEach((pokemon) => {
    availablePokemonHTML += `<option value="${pokemon}" class="encounter-combobox-options js-${pokemon}-option js-${locationNoSpace}-encounter-combobox-options">${pokemon}</option>`
  });

  return availablePokemonHTML;
}

function statusHTMLCreator(){

  return `<select name="Status" class="every-combobox">
            <option value="none" selected disabled hidden>Status</option>
            <option value="Alive">Captured</option>
            <option value="Boxed">Dead</option>
            <option value="Released">Missed</option>
            <option value="Released">Received</option>
          </select>`;
}

function naturesHTMLCreator(){
  let naturesHTMLOptions = ''

  let natures = ["Adamant", "Bashful", "Bold", "Brave", "Calm", "Careful", "Docile", "Gentle",
                  "Hardy", "Hasty", "Impish", "Jolly", "Lax", "Lonely", "Mild", "Modest", "Naive",
                  "Naughty", "Quiet", "Quirky", "Rash", "Relaxed", "Sassy", "Serious", "Timid"]

  natures.forEach(nature => {
    naturesHTMLOptions += `<option value="${nature}">${nature}</option>`
  }) 


  return `<select name="Natures" class="every-combobox">
            <option value="none" selected disabled hidden>Natures</option>
            ${naturesHTMLOptions}
          </select>`;
}

// function temp(){
//   let encounterRouteSelect = document.querySelectorAll(`.js-encounter-active`);
//   console.log(encounterRouteSelect);
// }

fetchData();


let activePokemonEvolutionLines = [];
let activePokemonInCombobox = [];

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