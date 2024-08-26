
// Kraazy, async/await raman diay gamiton instead nga solo fetch
async function fetchData(){
  try{
    const response = await fetch("../locations-in-json/platinum_locations.json");

    const data = await response.json();

    loadHTML(data);
  } catch(error){
    console.error(error);
  }
}

function getPokemonEncountersAtEachLocation(location){
  try{
    let availablePokemon = [];
    let location_links = [];
    
    // Get from PokeAPI encounter-condition-value
    const notConsideredEncounterConditions = ["swarm-yes", "radar-on", "slot2-firered", "slot2-none", "slot2-ruby", "slot2-sapphire", "slot2-emerald", "slot2-firered", "slot2-leafgreen", "radio-off","radio-hoenn","radio-sinnoh"]

    // Get each sublocation; can be shortened

    location["location-links"].forEach(location_link => location_links.push(location_link));

    // Traverse through each sublocation...
    location_links.forEach(async location_link => {
      // ... to fetch the data of each sublocation.
      const locationObjectFetch = await fetch(location_link);

      const locationObject = await locationObjectFetch.json();

      const locationObjectPokemonEncounters = locationObject["pokemon_encounters"];

      console.log(locationObjectPokemonEncounters);
      

      // Traverse each pokemon to determine if its "swarm", "gift", or not
      locationObjectPokemonEncounters.forEach(pokemonEncounter => {
        // This means pokemon is present in Diamond, Pearl, and Platinum
        // In this case, we get the last element
        if (pokemonEncounter["version_details"].length === 3){
          // Mali ni
          if (pokemonEncounter["version_details"][2]["encounter_details"][0]["condition_values"].length === 0){
            return; 
          } else if (notConsideredEncounterConditions.includes(pokemonEncounter["version_details"][2]["encounter_details"][0]["condition_values"][0]["name"])){
            // Bro that is unreadable..
            return;
          } else {
            availablePokemon.push(pokemonEncounter["pokemon"]["name"]);
          }
        } else if (pokemonEncounter["version_details"].length === 1){
          if (pokemonEncounter["version_details"][0]["encounter_details"][0]["condition_values"].length === 0){
            return; 
          } else if (notConsideredEncounterConditions.includes(pokemonEncounter["version_details"][0]["encounter_details"][0]["condition_values"][0]["name"])){
            return;
          } else {
            availablePokemon.push(pokemonEncounter["pokemon"]["name"]);
          }
        }
      });

      console.log(availablePokemon);
    });


  } catch(error){
    console.error(error);
  }
}

function loadHTML(dataFromJSON){
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

  for (let i = 0; i < 3; i++){
    sampleRoutes.push(dataFromJSON[i]);
  }

  console.log(sampleRoutes);

  let entireHTML = '';


  sampleRoutes.forEach((sampleRoute) => {
    entireHTML += `<div class="location-row js-location-row">
                    <p class="location-text">${sampleRoute.location}</p>
                    <select name="Route 1" class="every-combobox">
                      //$ {availablePokemonHTMLCreator(sampleRoute.availablePokemon)}
                    </select>

                    <input type="text" placeholder="Input nickname" class="input-nickname">

                    <select name="Route 1" class="every-combobox">
                      <option value="volvo">Status</option>
                    </select>

                    <select name="Route 1" class="every-combobox">
                      <option value="volvo">Natures</option>
                    </select>
                </div>`;
  });

  document.querySelector('.js-center-box-container')
      .innerHTML = entireHTML;

}

function availablePokemonHTMLCreator(availablePokemon){
  let availablePokemonHTML = '<option value="none" selected disabled hidden>Find encounter</option>';

  availablePokemon.forEach((pokemon) => {
    availablePokemonHTML += `<option value="${pokemon}">${pokemon}</option>`
  });

  return availablePokemonHTML;
}

fetchData();

getPokemonEncountersAtEachLocation({
  "location": "Route 201",
  "location-links": ["https://pokeapi.co/api/v2/location-area/141/"]
});

// fetch("../scripts/track/test.json")
//   .then(response => {
//     response.json();
//   }).then(data =>  {console.log(data); console.log('done')});




// fetch('./platinum_locations.json').then(response => {response.json()}).then(data => console.log(data));
//144 is the limit for encounters in Platinum

// fetch("https://pokeapi.co/api/v2/location-area/?limit=144").then(response => response.json().then(data => console.log(data))).catch(error => console.error(error()));