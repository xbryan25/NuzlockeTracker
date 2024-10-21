// TODO: BRANCHED EVOLUTIONS FOR EEVEE; FINAL FEATURE BEFORE PUTTING THE PROJECT ON HOLD

import { retrieveEvolutionLine, retrieveFrontDefaultSprite } from "./utils.js";

export async function evolvePokemon(location){
  // This function returns a function, this is because it will be added to an eventListener

  return async function (){
    let targetEncounterCombobox = document.querySelector(`.js-encounter-${location}`);

    let currentPokemonInCombobox = targetEncounterCombobox.value;
    let evolutionLine = await retrieveEvolutionLine(location);

    let hasBranchedEvolution = false;
    let isSilcoonOrCascoon = false;
    let isTyrogue = false;
    let isEevee = false;
    
    // Swap Beautifly with Cascoon
    if (currentPokemonInCombobox === "Wurmple"){
      let tempPokemonHolder = evolutionLine[3];

      evolutionLine[3] = evolutionLine[2];
      evolutionLine[2] = tempPokemonHolder;
    }

    if (currentPokemonInCombobox === "Silcoon" || currentPokemonInCombobox == "Cascoon"){
      isSilcoonOrCascoon = true;
    } else if (currentPokemonInCombobox === "Tyrogue"){
      isTyrogue = true;
    } else if (currentPokemonInCombobox === "Eevee"){
      isEevee = true;
    }


    // Modify the function variable
    // evolveHandler = function(){
    //   evolvePokemon(targetEncounterCombobox.value, evolutionLine, location, evolveHandler);
    // }

    // TODO: Put in a JSON file later; about pokemon with branched evolution lines

    // let branchedEvolutionLines = [["Oddish", "Gloom", "Vileplume", "Bellossom"],
    //                             ["Poliwag", "Poliwhirl", "Poliwrath", "Politoed"],
    //                             ["Slowpoke", "Slowbro", "Slowking"],
    //                             ["Eevee", "Vaporeon", "Jolteon", "Flareon", "Espeon", "Umbreon", "Leafeon", "Glaceon", "Sylveon"],
    //                             ["Tyrogue", "Hitmonlee", "Hitmonchan", "Hitmontop"],
    //                             ["Wurmple", "Silcoon", "Cascoon", "Beautifly", "Dustox"],
    //                             ["Ralts", "Kirlia", "Gardevoir", "Gallade"],
    //                             ["Nincada", "Ninjask", "Shedinja"],
    //                             ["Snorunt", "Glalie", "Froslass"],
    //                             ["Clamperl", "Huntail", "Gorebyss"]]

    // TODO: Rename array to simpleBranchedEvolutionMarkers

    let branchedEvolutionMarkers = ["Oddish", "Poliwhirl", "Slowpoke", "Tyrogue", "Wurmple", "Kirlia", "Nincada", 
                                    "Snorunt", "Clamperl", "Eevee"]
                                  
    if (branchedEvolutionMarkers.includes(currentPokemonInCombobox)){
      hasBranchedEvolution = true;
    }

    // This means that an evolution still exists and is not a branch evolution
    if (evolutionLine[evolutionLine.indexOf(currentPokemonInCombobox) + 1] && !hasBranchedEvolution && !isTyrogue && !isEevee){
      let evolutionOfCurrentPokemon;

      if (!isSilcoonOrCascoon){
        evolutionOfCurrentPokemon = evolutionLine[evolutionLine.indexOf(currentPokemonInCombobox) + 1];
      } else{
        evolutionOfCurrentPokemon = evolutionLine[evolutionLine.indexOf(currentPokemonInCombobox) + 2];
      }

      let pokemonPicLink = await retrieveFrontDefaultSprite(currentPokemonInCombobox);
      let pokemonNextEvoPicLink = await retrieveFrontDefaultSprite(evolutionOfCurrentPokemon);

      let popupButtonContent = `<div class="overlay"></div>
			<div class="content">
				<div class="close-btn js-close-btn">&times;</div>
				<h1 class="content-h1">Evolve ${currentPokemonInCombobox}?</h1>

				<div class="popup-img-container">
          <div class="preevo-container">
            <img src="${pokemonPicLink}" title="${currentPokemonInCombobox}" height="110px" class="preevo-animation-img">

            <p class="preevo-text">${currentPokemonInCombobox}</p>
          </div>

          <div class="arrow-container"> ➤➤➤ </div>

          <div class="nextevo-container">
            <img src="${pokemonNextEvoPicLink}" title="Evolve ${currentPokemonInCombobox} into ${evolutionOfCurrentPokemon}" height="110px" class="js-nextevo-img nextevo-animation-img">

            <p class="nextevo-text">${evolutionOfCurrentPokemon}</p>
          </div>
				</div>

        
				
			</div>`;

      document.querySelector(".js-popup-1").innerHTML = popupButtonContent;

      // document.querySelector(".js-popup-1").classList.remove("active");

      // For the exit button of the popup screen

      const popUpExitButton = document.querySelector('.js-close-btn');
      popUpExitButton.addEventListener('click', () => {
        // TODO: Make this into a function

        // set .active to off
        document.querySelector(".js-popup-1").classList.remove("active");

        // Reset innerHTML everytime the popup window is closed
        document.querySelector(".js-popup-1").innerHTML = "";
        
      });

      const nextevoImage = document.querySelector('.js-nextevo-img');
      nextevoImage.addEventListener('click', () => {
        targetEncounterCombobox.innerHTML += `<option value="${evolutionOfCurrentPokemon}" class="js-${location}-encounter-display" selected disabled hidden>${evolutionOfCurrentPokemon}</option>`;

        targetEncounterCombobox.value = evolutionOfCurrentPokemon;

        if (!evolutionLine[evolutionLine.indexOf(targetEncounterCombobox.value) + 1]){
          document.querySelector(`.js-evolve-${location}-button`).style.display = "none";
        }

        // TODO: Make this into a function
        // set .active to off
        document.querySelector(".js-popup-1").classList.remove("active");

        // Reset innerHTML everytime the popup window is closed
        document.querySelector(".js-popup-1").innerHTML = "";
      });

    } else if (evolutionLine[evolutionLine.indexOf(currentPokemonInCombobox) + 1] && evolutionLine[evolutionLine.indexOf(currentPokemonInCombobox) + 1] && hasBranchedEvolution){
      // Evolutions with two branches

      if (isTyrogue){
        let evolutionOfCurrentPokemonFirst = evolutionLine[evolutionLine.indexOf(currentPokemonInCombobox) + 1];
        let evolutionOfCurrentPokemonSecond = evolutionLine[evolutionLine.indexOf(currentPokemonInCombobox) + 2];
        let evolutionOfCurrentPokemonThird = evolutionLine[evolutionLine.indexOf(currentPokemonInCombobox) + 3];

        let pokemonPicLink = await retrieveFrontDefaultSprite(currentPokemonInCombobox);

        let pokemonNextEvoPicFirstLink = await retrieveFrontDefaultSprite(evolutionOfCurrentPokemonFirst);
        let pokemonNextEvoPicSecondLink = await retrieveFrontDefaultSprite(evolutionOfCurrentPokemonSecond);
        let pokemonNextEvoPicThirdLink = await retrieveFrontDefaultSprite(evolutionOfCurrentPokemonThird);

        let popupButtonContent = `<div class="overlay"></div>
        <div class="content-tyrogue">
          <div class="close-btn js-close-btn">&times;</div>
          <h1 class="content-h1">Evolve ${currentPokemonInCombobox}?</h1>

          <div class="popup-img-container-branch">
            <div class="preevo-container-tyrogue">
              <img src="${pokemonPicLink}" title="${currentPokemonInCombobox}" height="110px" class="preevo-animation-img">

              <p class="preevo-text">${currentPokemonInCombobox}</p>
            </div>

            <div class="arrow-container-tyrogue"> ➤➤➤ </div>

            <div class="nextevo-container-branch">
              <div class="nextevo-container-first">
                <img src="${pokemonNextEvoPicFirstLink}" title="Evolve ${currentPokemonInCombobox} into ${evolutionOfCurrentPokemonFirst}" height="110px" class="js-nextevo-img-first nextevo-animation-img">

                <p class="nextevo-text">${evolutionOfCurrentPokemonFirst}</p>
              </div>

              <div class="nextevo-container-second">
                <img src="${pokemonNextEvoPicSecondLink}" title="Evolve ${currentPokemonInCombobox} into ${evolutionOfCurrentPokemonSecond}" height="110px" class="js-nextevo-img-second nextevo-animation-img">

                <p class="nextevo-text">${evolutionOfCurrentPokemonSecond}</p>
              </div>

              <div class="nextevo-container-third">
                <img src="${pokemonNextEvoPicThirdLink}" title="Evolve ${currentPokemonInCombobox} into ${evolutionOfCurrentPokemonThird}" height="110px" class="js-nextevo-img-third nextevo-animation-img">

                <p class="nextevo-text">${evolutionOfCurrentPokemonThird}</p>
              </div>
              
            </div>  
          </div>
        </div>`;

        document.querySelector(".js-popup-1").innerHTML = popupButtonContent;

        const nextevoImageFirst = document.querySelector('.js-nextevo-img-first');
        nextevoImageFirst.addEventListener('click', () => {
          targetEncounterCombobox.innerHTML += `<option value="${evolutionOfCurrentPokemonFirst}" class="js-${location}-encounter-display" selected disabled hidden>${evolutionOfCurrentPokemonFirst}</option>`;

          targetEncounterCombobox.value = evolutionOfCurrentPokemonFirst;

          if (!evolutionLine[evolutionLine.indexOf(targetEncounterCombobox.value) + 1]){
            document.querySelector(`.js-evolve-${location}-button`).style.display = "none";
          }

          // TODO: Make this into a function
          // set .active to off
          document.querySelector(".js-popup-1").classList.remove("active");

          // Reset innerHTML everytime the popup window is closed
          document.querySelector(".js-popup-1").innerHTML = "";

          checkIfFromBranchedEvolution(location);
        });

        const nextevoImageSecond = document.querySelector('.js-nextevo-img-second');
        nextevoImageSecond.addEventListener('click', () => {
          targetEncounterCombobox.innerHTML += `<option value="${evolutionOfCurrentPokemonSecond}" class="js-${location}-encounter-display" selected disabled hidden>${evolutionOfCurrentPokemonSecond}</option>`;

          targetEncounterCombobox.value = evolutionOfCurrentPokemonSecond;

          if (!evolutionLine[evolutionLine.indexOf(targetEncounterCombobox.value) + 1]){
            document.querySelector(`.js-evolve-${location}-button`).style.display = "none";
          }

          // TODO: Make this into a function
          // set .active to off
          document.querySelector(".js-popup-1").classList.remove("active");

          // Reset innerHTML everytime the popup window is closed
          document.querySelector(".js-popup-1").innerHTML = "";

          checkIfFromBranchedEvolution(location);
        });

        const nextevoImageThird = document.querySelector('.js-nextevo-img-third');
        nextevoImageThird.addEventListener('click', () => {
          targetEncounterCombobox.innerHTML += `<option value="${evolutionOfCurrentPokemonThird}" class="js-${location}-encounter-display" selected disabled hidden>${evolutionOfCurrentPokemonThird}</option>`;

          targetEncounterCombobox.value = evolutionOfCurrentPokemonThird;

          if (!evolutionLine[evolutionLine.indexOf(targetEncounterCombobox.value) + 1]){
            document.querySelector(`.js-evolve-${location}-button`).style.display = "none";
          }

          // TODO: Make this into a function
          // set .active to off
          document.querySelector(".js-popup-1").classList.remove("active");

          // Reset innerHTML everytime the popup window is closed
          document.querySelector(".js-popup-1").innerHTML = "";

          checkIfFromBranchedEvolution(location);
        });

      } else if (isEevee){

        let pokemonPicLink = await retrieveFrontDefaultSprite(currentPokemonInCombobox);
        
        let pokemonNextEvoPicLinks = [await retrieveFrontDefaultSprite(evolutionLine[1]),
                                      await retrieveFrontDefaultSprite(evolutionLine[2]),
                                      await retrieveFrontDefaultSprite(evolutionLine[3]),
                                      await retrieveFrontDefaultSprite(evolutionLine[4]),
                                      await retrieveFrontDefaultSprite(evolutionLine[5]),
                                      await retrieveFrontDefaultSprite(evolutionLine[6]),
                                      await retrieveFrontDefaultSprite(evolutionLine[7])];


        let popupButtonContent = `<div class="overlay"></div>
        <div class="content-tyrogue">
          <div class="close-btn js-close-btn">&times;</div>
          <h1 class="content-h1">Evolve ${currentPokemonInCombobox}?</h1>

          <div class="popup-img-container-branch">
            <div class="preevo-container-eevee">
              <img src="${pokemonPicLink}" title="${currentPokemonInCombobox}" height="110px" class="preevo-animation-img">

              <p class="preevo-text">${currentPokemonInCombobox}</p>
            </div>

            <div class="arrow-container-eevee"> ➤➤➤ </div>

            <div class="nextevo-container-first-row">
              <div class="nextevo-container-first">
                <img src="${pokemonNextEvoPicLinks[0]}" title="Evolve ${currentPokemonInCombobox} into ${evolutionLine[1]}" height="110px" class="js-nextevo-img-first nextevo-animation-img">

                <p class="nextevo-text">${evolutionLine[1]}</p>
              </div>

              <div class="nextevo-container-second">
                <img src="${pokemonNextEvoPicLinks[1]}" title="Evolve ${currentPokemonInCombobox} into ${evolutionLine[2]}" height="110px" class="js-nextevo-img-first nextevo-animation-img">

                <p class="nextevo-text">${evolutionLine[2]}</p>
              </div>

              <div class="nextevo-container-first">
                <img src="${pokemonNextEvoPicLinks[2]}" title="Evolve ${currentPokemonInCombobox} into ${evolutionLine[3]}" height="110px" class="js-nextevo-img-first nextevo-animation-img">

                <p class="nextevo-text">${evolutionLine[3]}</p>
              </div>
              
            </div>
            
            <div class="nextevo-container-second-row">
              <div class="nextevo-container-first">
                <img src="${pokemonNextEvoPicLinks[3]}" title="Evolve ${currentPokemonInCombobox} into ${evolutionLine[4]}" height="110px" class="js-nextevo-img-first nextevo-animation-img">

                <p class="nextevo-text">${evolutionLine[4]}</p>
              </div>

              <div class="nextevo-container-first">
                <img src="${pokemonNextEvoPicLinks[4]}" title="Evolve ${currentPokemonInCombobox} into ${evolutionLine[5]}" height="110px" class="js-nextevo-img-first nextevo-animation-img">

                <p class="nextevo-text">${evolutionLine[5]}</p>
              </div>
              
            </div>
            
            <div class="nextevo-container-third-row">
              <div class="nextevo-container-first">
                <img src="${pokemonNextEvoPicLinks[5]}" title="Evolve ${currentPokemonInCombobox} into ${evolutionLine[6]}" height="110px" class="js-nextevo-img-first nextevo-animation-img">

                <p class="nextevo-text">${evolutionLine[6]}</p>
              </div>

              <div class="nextevo-container-first">
                <img src="${pokemonNextEvoPicLinks[6]}" title="Evolve ${currentPokemonInCombobox} into ${evolutionLine[7]}" height="110px" class="js-nextevo-img-first nextevo-animation-img">

                <p class="nextevo-text">${evolutionLine[7]}</p>
              </div>
              
            </div>  
          </div>
        </div>`;

        document.querySelector(".js-popup-1").innerHTML = popupButtonContent;

        const nextevoImageFirst = document.querySelector('.js-nextevo-img-first');
        nextevoImageFirst.addEventListener('click', () => {
          targetEncounterCombobox.innerHTML += `<option value="${evolutionOfCurrentPokemonFirst}" class="js-${location}-encounter-display" selected disabled hidden>${evolutionOfCurrentPokemonFirst}</option>`;

          targetEncounterCombobox.value = evolutionOfCurrentPokemonFirst;

          if (!evolutionLine[evolutionLine.indexOf(targetEncounterCombobox.value) + 1]){
            document.querySelector(`.js-evolve-${location}-button`).style.display = "none";
          }

          // TODO: Make this into a function
          // set .active to off
          document.querySelector(".js-popup-1").classList.remove("active");

          // Reset innerHTML everytime the popup window is closed
          document.querySelector(".js-popup-1").innerHTML = "";

          checkIfFromBranchedEvolution(location);
        });

        const nextevoImageSecond = document.querySelector('.js-nextevo-img-second');
        nextevoImageSecond.addEventListener('click', () => {
          targetEncounterCombobox.innerHTML += `<option value="${evolutionOfCurrentPokemonSecond}" class="js-${location}-encounter-display" selected disabled hidden>${evolutionOfCurrentPokemonSecond}</option>`;

          targetEncounterCombobox.value = evolutionOfCurrentPokemonSecond;

          if (!evolutionLine[evolutionLine.indexOf(targetEncounterCombobox.value) + 1]){
            document.querySelector(`.js-evolve-${location}-button`).style.display = "none";
          }

          // TODO: Make this into a function
          // set .active to off
          document.querySelector(".js-popup-1").classList.remove("active");

          // Reset innerHTML everytime the popup window is closed
          document.querySelector(".js-popup-1").innerHTML = "";

          checkIfFromBranchedEvolution(location);
        });

        const nextevoImageThird = document.querySelector('.js-nextevo-img-third');
        nextevoImageThird.addEventListener('click', () => {
          targetEncounterCombobox.innerHTML += `<option value="${evolutionOfCurrentPokemonThird}" class="js-${location}-encounter-display" selected disabled hidden>${evolutionOfCurrentPokemonThird}</option>`;

          targetEncounterCombobox.value = evolutionOfCurrentPokemonThird;

          if (!evolutionLine[evolutionLine.indexOf(targetEncounterCombobox.value) + 1]){
            document.querySelector(`.js-evolve-${location}-button`).style.display = "none";
          }

          // TODO: Make this into a function
          // set .active to off
          document.querySelector(".js-popup-1").classList.remove("active");

          // Reset innerHTML everytime the popup window is closed
          document.querySelector(".js-popup-1").innerHTML = "";

          checkIfFromBranchedEvolution(location);
        });
      }
      else{
        let evolutionOfCurrentPokemonFirst = evolutionLine[evolutionLine.indexOf(currentPokemonInCombobox) + 1];
        let evolutionOfCurrentPokemonSecond = evolutionLine[evolutionLine.indexOf(currentPokemonInCombobox) + 2];

        let pokemonPicLink = await retrieveFrontDefaultSprite(currentPokemonInCombobox);

        let pokemonNextEvoPicFirstLink = await retrieveFrontDefaultSprite(evolutionOfCurrentPokemonFirst);
        let pokemonNextEvoPicSecondLink = await retrieveFrontDefaultSprite(evolutionOfCurrentPokemonSecond);

        let popupButtonContent = `<div class="overlay"></div>
        <div class="content-branch">
          <div class="close-btn js-close-btn">&times;</div>
          <h1 class="content-h1">Evolve ${currentPokemonInCombobox}?</h1>

          <div class="popup-img-container-branch">
            <div class="preevo-container-branch">
              <img src="${pokemonPicLink}" title="${currentPokemonInCombobox}" height="110px" class="preevo-animation-img">

              <p class="preevo-text">${currentPokemonInCombobox}</p>
            </div>

            <div class="arrow-container"> ➤➤➤ </div>

            <div class="nextevo-container-branch">
              <div class="nextevo-container-first">
                <img src="${pokemonNextEvoPicFirstLink}" title="Evolve ${currentPokemonInCombobox} into ${evolutionOfCurrentPokemonFirst}" height="110px" class="js-nextevo-img-first nextevo-animation-img">

                <p class="nextevo-text">${evolutionOfCurrentPokemonFirst}</p>
              </div>

              <div class="nextevo-container-second">
                <img src="${pokemonNextEvoPicSecondLink}" title="Evolve ${currentPokemonInCombobox} into ${evolutionOfCurrentPokemonSecond}" height="110px" class="js-nextevo-img-second nextevo-animation-img">

                <p class="nextevo-text">${evolutionOfCurrentPokemonSecond}</p>
              </div>
              
            </div>  
          </div>
        </div>`;

        document.querySelector(".js-popup-1").innerHTML = popupButtonContent;

        const nextevoImageFirst = document.querySelector('.js-nextevo-img-first');
        nextevoImageFirst.addEventListener('click', () => {
          targetEncounterCombobox.innerHTML += `<option value="${evolutionOfCurrentPokemonFirst}" class="js-${location}-encounter-display" selected disabled hidden>${evolutionOfCurrentPokemonFirst}</option>`;

          targetEncounterCombobox.value = evolutionOfCurrentPokemonFirst;

          if (!evolutionLine[evolutionLine.indexOf(targetEncounterCombobox.value) + 1]){
            document.querySelector(`.js-evolve-${location}-button`).style.display = "none";
          }

          // TODO: Make this into a function
          // set .active to off
          document.querySelector(".js-popup-1").classList.remove("active");

          // Reset innerHTML everytime the popup window is closed
          document.querySelector(".js-popup-1").innerHTML = "";

          checkIfFromBranchedEvolution(location);
        });

        const nextevoImageSecond = document.querySelector('.js-nextevo-img-second');
        nextevoImageSecond.addEventListener('click', () => {
          targetEncounterCombobox.innerHTML += `<option value="${evolutionOfCurrentPokemonSecond}" class="js-${location}-encounter-display" selected disabled hidden>${evolutionOfCurrentPokemonSecond}</option>`;

          targetEncounterCombobox.value = evolutionOfCurrentPokemonSecond;

          if (!evolutionLine[evolutionLine.indexOf(targetEncounterCombobox.value) + 1]){
            document.querySelector(`.js-evolve-${location}-button`).style.display = "none";
          }

          // TODO: Make this into a function
          // set .active to off
          document.querySelector(".js-popup-1").classList.remove("active");

          // Reset innerHTML everytime the popup window is closed
          document.querySelector(".js-popup-1").innerHTML = "";

          checkIfFromBranchedEvolution(location);
        });
      }

      

      // document.querySelector(".js-popup-1").classList.remove("active");

      // For the exit button of the popup screen

      const popUpExitButton = document.querySelector('.js-close-btn');
      popUpExitButton.addEventListener('click', () => {
        // TODO: Make this into a function

        // set .active to off
        document.querySelector(".js-popup-1").classList.remove("active");

        // Reset innerHTML everytime the popup window is closed
        document.querySelector(".js-popup-1").innerHTML = "";
        
      });
    }

    let evolveButton = document.querySelector(`.js-evolve-${location}-button`);

    // Get updated value of combobox
    currentPokemonInCombobox = targetEncounterCombobox.value;

    let fromBranchedEvolution = false;
    let fromBranchedEvolutions = ["Vileplume", "Bellossom", "Poliwrath", "Politoed", "Slowbro", "Slowking",
      "Gardevoir", "Gallade", "Ninjask", "Shedinja", "Huntail", "Gorebyss"];

    if (fromBranchedEvolutions.includes(currentPokemonInCombobox)){
      fromBranchedEvolution = true;
    }


    if (fromBranchedEvolution){
      evolveButton.style.display = "none";
    } 
    
    // else if (!evolutionLine[evolutionLine.indexOf(currentPokemonInCombobox) + 1]){
    //   document.querySelector(`.js-evolve-${location}-button`).style.display = "none";
    // }
  };
}

function checkIfFromBranchedEvolution(location){
  // Function purpose: Stop the evolution of branched evolution

  let evolveButton = document.querySelector(`.js-evolve-${location}-button`);

  // Value of combobox
  let targetEncounterCombobox = document.querySelector(`.js-encounter-${location}`);
  let currentPokemonInCombobox = targetEncounterCombobox.value;

  let fromBranchedEvolution = false;
  let fromBranchedEvolutions = ["Vileplume", "Bellossom", "Poliwrath", "Politoed", "Slowbro", "Slowking",
    "Gardevoir", "Gallade", "Ninjask", "Shedinja", "Huntail", "Gorebyss"];

  if (fromBranchedEvolutions.includes(currentPokemonInCombobox)){
    fromBranchedEvolution = true;
  }

  if (fromBranchedEvolution){
    evolveButton.style.display = "none";
  } 
}