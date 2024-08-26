

let userDecision = localStorage.getItem('userDecision');

document.querySelector('.js-heading-text').innerHTML = `Pokemon ${userDecision}`;

// let testRouteAll = JSON.parse(platinum_locations);
// console.log(testRouteAll);


let sampleRoutes = [{
  location: 'Route 1',
  availablePokemon: ['Charmander', 'Squirtle', 'Bulbasaur']
}, {
  location: 'Route 2',
  availablePokemon: ['Pidgey', 'Rattata', 'Mankey']
}]

let entireHTML = '';


sampleRoutes.forEach((sampleRoute) => {
  entireHTML += `<div class="location-row js-location-row">
                  <p class="location-text">${sampleRoute.location}</p>
                  <select name="Route 1" class="every-combobox">
                    ${availablePokemonHTMLCreator(sampleRoute.availablePokemon)}
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

function availablePokemonHTMLCreator(availablePokemon){
  let availablePokemonHTML = '<option value="none" selected disabled hidden>Find encounter</option>';

  availablePokemon.forEach((pokemon) => {
    availablePokemonHTML += `<option value="${pokemon}">${pokemon}</option>`
  });

  return availablePokemonHTML;
}



document.querySelector('.js-center-box-container')
    .innerHTML = entireHTML;

fetchData();

async function fetchData(){
  try{
    const response = await fetch("../locations-in-json/platinum_locations.json");

    const data = await response.json();

    console.log(data)
  } catch(error){
    console.error(error);
  }
}

// fetch("../scripts/track/test.json")
//   .then(response => {
//     response.json();
//   }).then(data =>  {console.log(data); console.log('done')});




// fetch('./platinum_locations.json').then(response => {response.json()}).then(data => console.log(data));
//144 is the limit for encounters in Platinum

// fetch("https://pokeapi.co/api/v2/location-area/?limit=144").then(response => response.json().then(data => console.log(data))).catch(error => console.error(error()));