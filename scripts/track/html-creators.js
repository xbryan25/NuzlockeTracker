import {getPokemonEncountersAtEachLocation} from "./get-pokemon.js";


export async function availablePokemonHTMLCreator(locationObject){
  let locationNoSpace = locationObject.location.split(' ').join('');

  let availablePokemon = await getPokemonEncountersAtEachLocation(locationObject);

  let availablePokemonHTML = `<option value="none" class="js-${locationNoSpace}-placeholder"selected disabled hidden>Find encounter</option>`;

  availablePokemon.forEach((pokemon) => {
    availablePokemonHTML += `<option value="${pokemon}" class="encounter-combobox-options js-${pokemon}-option js-${locationNoSpace}-encounter-combobox-options" data-img-width="16px">${pokemon}</option>`
  });

  return availablePokemonHTML;
}

export function statusHTMLCreator(location){

  return `<select name="Status" class="status-and-natures-combobox js-${location}-status-and-nature-combobox">
            <option value="none" selected disabled hidden>Status</option>
            <option value="Captured">Captured</option>
            <option value="Dead">Dead</option>
            <option value="Missed">Missed</option>
            <option value="Received">Received</option>
          </select>`;
}

export function naturesHTMLCreator(location){
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

export function clearEncounterHTMLCreator(location){
  return `<button class="clear-encounter-button js-clear-encounter-${location}" title="Clear encounter"><div class="clear-encounter-button-text">✖</div></button>`;

}