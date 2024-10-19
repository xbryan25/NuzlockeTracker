import {fetchLocationDataFromApi} from "./utils.js";

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

export async function getPokemonEncountersAtEachLocation(location){
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