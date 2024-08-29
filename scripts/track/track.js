
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

    availablePokemonArrays.forEach(availablePokemonArray => {
      availablePokemonArray.forEach(pokemon => {
        if (!availablePokemon.includes(pokemon)){
          availablePokemon.push(pokemon.charAt(0).toUpperCase() + pokemon.slice(1));
        }
      });
    });

    return availablePokemon;

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

  document.querySelector('.js-heading-text').innerHTML = `Pokemon ${userDecision}`;

  // let sampleRoutes = [{
  //   location: 'Route 1',
  //   availablePokemon: ['Charmander', 'Squirtle', 'Bulbasaur']
  // }, {
  //   location: 'Route 2',
  //   availablePokemon: ['Pidgey', 'Rattata', 'Mankey']
  // }]

  let sampleRoutes = [];

  // for (let i = 1; i < 100; i++){
  //   if (dataFromJSON[i]["location"] === "Route 210"){
  //     sampleRoutes.push(dataFromJSON[i]);
  //     break;
  //   }
  // }

  for (let i = 0; i < 5; i++){
    sampleRoutes.push(dataFromJSON[i]);
  }

  console.log(sampleRoutes);

  let entireHTML = '';

  for (let sampleRoute of sampleRoutes){
    let optionsHTML = await availablePokemonHTMLCreator(sampleRoute);
    console.log(optionsHTML);

    entireHTML += `<div class="location-row js-location-row">
                    <p class="location-text">${sampleRoute.location}</p>
                    <select name="Route 1" class="every-combobox">
                      ${optionsHTML}
                    </select>

                    <input type="text" placeholder="Input nickname" class="input-nickname">

                    <select name="Route 1" class="every-combobox">
                      <option value="volvo">Status</option>
                    </select>

                    <select name="Route 1" class="every-combobox">
                      <option value="volvo">Natures</option>
                    </select>
                </div>`;
  }


  document.querySelector('.js-center-box-container')
      .innerHTML = entireHTML;

}

async function availablePokemonHTMLCreator(location){

  let availablePokemon = await getPokemonEncountersAtEachLocation(location);

  let availablePokemonHTML = '<option value="none" selected disabled hidden>Find encounter</option>';

  availablePokemon.forEach((pokemon) => {
    availablePokemonHTML += `<option value="${pokemon}">${pokemon}</option>`
  });

  return availablePokemonHTML;
}

fetchData();

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