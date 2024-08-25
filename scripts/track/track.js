

let userDecision = localStorage.getItem('userDecision');

document.querySelector('.js-heading-text').innerHTML = `Pokemon ${userDecision}`;

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
                    <option value="volvo">Volvo</option>
                  </select>

                  <select name="Route 1" class="every-combobox">
                    ${availablePokemonHTMLCreator(sampleRoute.availablePokemon)}
                  </select>

                  <select name="Route 1" class="every-combobox">
                    <option value="volvo">Chagra</option>
                  </select>

                  <select name="Route 1" class="every-combobox">
                    <option value="volvo">Chagra</option>
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



// document.querySelector('.js-center-box')
//     .innerHTML = `<p class="location-text">Route 1</p>
//                 <select name="Route 1" class="every-combobox">
//                     <option value="volvo">Volvo</option>
//                 </select>

//                 <select name="Route 1" class="every-combobox">
//                         <option value="volvo">Chagra</option>
//                 </select>

//                 <select name="Route 1" class="every-combobox">
//                         <option value="volvo">Chagra</option>
//                 </select>

//                 <select name="Route 1" class="every-combobox">
//                         <option value="volvo">Chagra</option>
//                 </select>
                
//                 `;

document.querySelector('.js-center-box-container')
    .innerHTML = entireHTML;


