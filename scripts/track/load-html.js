// Add icons to tabs
// Add button to download progress in csv/pdf
// Add button to import progress using csv

import {availablePokemonHTMLCreator, statusHTMLCreator, naturesHTMLCreator, clearEncounterHTMLCreator} from "./html-creators.js";
import {removeEncounterDisplays, returnToMainScreen, activeStatusOrNature, searchForPokemonOrLocation} from "./utils.js"
import {displayDupe} from "./display-dupe.js"
import {showKillPokemonButton, showEvolvePokemonButton} from "./show-buttons.js";
import {clearEncounter, clearAllEncounters} from "./clear-encounter.js";
import {changeStatusToDead, changeDayNightLook} from "./edit-html.js";
import {evolvePokemon} from "./about-evolution.js";


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

  document.querySelector('.js-header-div-container').innerHTML = `<div class="js-heading-pic header-div-pic"></div>
                                                        <div class="js-header-div-game-title header-div-game-title"></div>

                                                        <button class="js-clear-all-encounters-button clear-all-encounters-button">Clear all encounters</button>
                                                        
                                                        <input type="text" placeholder="Search..." class="search-input js-search-input">
                                                        
                                                        <div class="js-change-day-night-look change-day-night-look">☀</div>`;

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


fetchData();