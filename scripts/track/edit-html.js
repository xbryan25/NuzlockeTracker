export function changeStatusToDead(location){
  document.querySelectorAll(`.js-${location}-status-and-nature-combobox`)[0].value = "Dead";
}

export function changeDayNightLook(encounterRouteObjects){
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