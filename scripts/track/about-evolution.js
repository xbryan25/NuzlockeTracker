// TODO: Speed up the appearance of the evolve button

import { retrieveEvolutionLine, retrieveFrontDefaultSprite, addEventListenerToExitButton, removePopupUponSelectingAnEvolution } from "./utils.js";

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
    
    // For Wurmple evolution line, swap Beautifly with Cascoon
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

    let branchedEvolutionMarkers = ["Gloom", "Poliwhirl", "Slowpoke", "Tyrogue", "Wurmple", "Kirlia", "Nincada", 
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

      addEventListenerToExitButton();

      const nextevoImage = document.querySelector('.js-nextevo-img');
      nextevoImage.addEventListener('click', () => {
        targetEncounterCombobox.innerHTML += `<option value="${evolutionOfCurrentPokemon}" class="js-${location}-encounter-display" selected disabled hidden>${evolutionOfCurrentPokemon}</option>`;

        targetEncounterCombobox.value = evolutionOfCurrentPokemon;

        if (!evolutionLine[evolutionLine.indexOf(targetEncounterCombobox.value) + 1]){
          document.querySelector(`.js-evolve-${location}-button`).style.display = "none";
        }

        removePopupUponSelectingAnEvolution();
      });

    } else if (evolutionLine[evolutionLine.indexOf(currentPokemonInCombobox) + 1] && evolutionLine[evolutionLine.indexOf(currentPokemonInCombobox) + 1] && hasBranchedEvolution){
      // Evolutions with two or more branches

      if (isTyrogue){
        let pokemonPicLink = await retrieveFrontDefaultSprite(currentPokemonInCombobox);

        let pokemonNextEvoPicLinks = [await retrieveFrontDefaultSprite(evolutionLine[1]),
                                      await retrieveFrontDefaultSprite(evolutionLine[2]),
                                      await retrieveFrontDefaultSprite(evolutionLine[3])];

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
                <img src="${pokemonNextEvoPicLinks[0]}" title="Evolve ${currentPokemonInCombobox} into ${evolutionLine[1]}" height="110px" class="js-nextevo-tyrogue nextevo-animation-img">

                <p class="nextevo-text">${evolutionLine[1]}</p>
              </div>

              <div class="nextevo-container-second">
                <img src="${pokemonNextEvoPicLinks[1]}" title="Evolve ${currentPokemonInCombobox} into ${evolutionLine[2]}" height="110px" class="js-nextevo-tyrogue nextevo-animation-img">

                <p class="nextevo-text">${evolutionLine[2]}</p>
              </div>

              <div class="nextevo-container-third">
                <img src="${pokemonNextEvoPicLinks[2]}" title="Evolve ${currentPokemonInCombobox} into ${evolutionLine[3]}" height="110px" class="js-nextevo-tyrogue nextevo-animation-img">

                <p class="nextevo-text">${evolutionLine[3]}</p>
              </div>
              
            </div>  
          </div>
        </div>`;

        document.querySelector(".js-popup-1").innerHTML = popupButtonContent;

        evolutionLine.forEach(nextEvolution => {
          if (nextEvolution === "Tyrogue"){
            return;
          } else{
            const nextevosOfTyrogue = document.querySelectorAll(`.js-nextevo-tyrogue`);

            nextevosOfTyrogue.forEach(nextevoOfTyrogue => {

              nextevoOfTyrogue.addEventListener('click', () => {
                const nextevosOfTyrogueArray = Array.prototype.slice.call(nextevosOfTyrogue)
                
                // To make the code less repetitive, get all elements in the class js-nextevo-eevee
                // Convert the node list into an array so that the indexOf() method can be used
                // Use the array to determine the position of the current node list, which will be used 
                // to get the value from evolutionLine
                
                targetEncounterCombobox.innerHTML += `<option value="${evolutionLine[nextevosOfTyrogueArray.indexOf(nextevoOfTyrogue) + 1]}" class="js-${location}-encounter-display" selected disabled hidden>${evolutionLine[nextevosOfTyrogueArray.indexOf(nextevoOfTyrogue) + 1]}</option>`;
  
                targetEncounterCombobox.value = evolutionLine[nextevosOfTyrogueArray.indexOf(nextevoOfTyrogue) + 1];
  
                document.querySelector(`.js-evolve-${location}-button`).style.display = "none";
                
                removePopupUponSelectingAnEvolution();
  
                checkIfFromBranchedEvolution(location);
              });
            });
          }
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
        <div class="content-eevee">
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
                <img src="${pokemonNextEvoPicLinks[0]}" title="Evolve ${currentPokemonInCombobox} into ${evolutionLine[1]}" height="110px" class="js-nextevo-eevee nextevo-animation-img">

                <p class="nextevo-text">${evolutionLine[1]}</p>
              </div>

              <div class="nextevo-container-second">
                <img src="${pokemonNextEvoPicLinks[1]}" title="Evolve ${currentPokemonInCombobox} into ${evolutionLine[2]}" height="110px" class="js-nextevo-eevee nextevo-animation-img">

                <p class="nextevo-text">${evolutionLine[2]}</p>
              </div>

              <div class="nextevo-container-first">
                <img src="${pokemonNextEvoPicLinks[2]}" title="Evolve ${currentPokemonInCombobox} into ${evolutionLine[3]}" height="110px" class="js-nextevo-eevee nextevo-animation-img">

                <p class="nextevo-text">${evolutionLine[3]}</p>
              </div>
              
            </div>
            
            <div class="nextevo-container-second-row">
              <div class="nextevo-container-first">
                <img src="${pokemonNextEvoPicLinks[3]}" title="Evolve ${currentPokemonInCombobox} into ${evolutionLine[4]}" height="110px" class="js-nextevo-eevee nextevo-animation-img">

                <p class="nextevo-text">${evolutionLine[4]}</p>
              </div>

              <div class="nextevo-container-first">
                <img src="${pokemonNextEvoPicLinks[4]}" title="Evolve ${currentPokemonInCombobox} into ${evolutionLine[5]}" height="110px" class="js-nextevo-eevee nextevo-animation-img">

                <p class="nextevo-text">${evolutionLine[5]}</p>
              </div>
              
            </div>
            
            <div class="nextevo-container-third-row">
              <div class="nextevo-container-first">
                <img src="${pokemonNextEvoPicLinks[5]}" title="Evolve ${currentPokemonInCombobox} into ${evolutionLine[6]}" height="110px" class="js-nextevo-eevee nextevo-animation-img">

                <p class="nextevo-text">${evolutionLine[6]}</p>
              </div>

              <div class="nextevo-container-first">
                <img src="${pokemonNextEvoPicLinks[6]}" title="Evolve ${currentPokemonInCombobox} into ${evolutionLine[7]}" height="110px" class="js-nextevo-eevee nextevo-animation-img">

                <p class="nextevo-text">${evolutionLine[7]}</p>
              </div>
              
            </div>  
          </div>
        </div>`;

        document.querySelector(".js-popup-1").innerHTML = popupButtonContent;


        evolutionLine.forEach(nextEvolution => {
          if (nextEvolution === "Eevee" || nextEvolution === "Sylveon"){
            return;
          } else{
            const nextevosOfEevee = document.querySelectorAll(`.js-nextevo-eevee`);

            nextevosOfEevee.forEach(nextevoOfEevee => {

              nextevoOfEevee.addEventListener('click', () => {
                const nextEvosOfEeveeArray = Array.prototype.slice.call(nextevosOfEevee)
                
                // To make the code less repetitive, get all elements in the class js-nextevo-eevee
                // Convert the node list into an array so that the indexOf() method can be used
                // Use the array to determine the position of the current node list, which will be used 
                // to get the value from evolutionLine
                
                targetEncounterCombobox.innerHTML += `<option value="${evolutionLine[nextEvosOfEeveeArray.indexOf(nextevoOfEevee) + 1]}" class="js-${location}-encounter-display" selected disabled hidden>${evolutionLine[nextEvosOfEeveeArray.indexOf(nextevoOfEevee) + 1]}</option>`;
  
                targetEncounterCombobox.value = evolutionLine[nextEvosOfEeveeArray.indexOf(nextevoOfEevee) + 1];
  
                document.querySelector(`.js-evolve-${location}-button`).style.display = "none";
                
                removePopupUponSelectingAnEvolution();
  
                checkIfFromBranchedEvolution(location);
              });
            });
          }
        });

      } else{
        // Only two branches

        let pokemonPicLink = await retrieveFrontDefaultSprite(currentPokemonInCombobox);


        let pokemonNextEvoPicLinks = [
          await retrieveFrontDefaultSprite(evolutionLine[evolutionLine.indexOf(currentPokemonInCombobox) + 1]),
          await retrieveFrontDefaultSprite(evolutionLine[evolutionLine.indexOf(currentPokemonInCombobox) + 2])];

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
                <img src="${pokemonNextEvoPicLinks[0]}" title="Evolve ${currentPokemonInCombobox} into ${evolutionLine[evolutionLine.indexOf(currentPokemonInCombobox) + 1]}" height="110px" class="js-nextevo-img  nextevo-animation-img">

                <p class="nextevo-text">${evolutionLine[evolutionLine.indexOf(currentPokemonInCombobox) + 1]}</p>
              </div>

              <div class="nextevo-container-second">
                <img src="${pokemonNextEvoPicLinks[1]}" title="Evolve ${currentPokemonInCombobox} into ${evolutionLine[evolutionLine.indexOf(currentPokemonInCombobox) + 2]}" height="110px" class="js-nextevo-img nextevo-animation-img">

                <p class="nextevo-text">${evolutionLine[evolutionLine.indexOf(currentPokemonInCombobox) + 2]}</p>
              </div>
              
            </div>  
          </div>
        </div>`;

        document.querySelector(".js-popup-1").innerHTML = popupButtonContent;

        evolutionLine.forEach(nextEvolution => {
          const nextevosOfPokemon = document.querySelectorAll(`.js-nextevo-img`);

          nextevosOfPokemon.forEach(nextevoOfPokemon => {
            // Special case for Gloom, Poliwhirl, and Kirlia, as they are middle evolutions
            // 1 is true, 0 is false

            const isMiddleEvo = (currentPokemonInCombobox == "Gloom" || currentPokemonInCombobox == "Poliwhirl" || currentPokemonInCombobox == "Kirlia") ? 1 : 0;

            nextevoOfPokemon.addEventListener('click', () => {
              const nextevosOfPokemonArray = Array.prototype.slice.call(nextevosOfPokemon)
              
              // To make the code less repetitive, get all elements in the class js-nextevo-eevee
              // Convert the node list into an array so that the indexOf() method can be used
              // Use the array to determine the position of the current node list, which will be used 
              // to get the value from evolutionLine
              
              targetEncounterCombobox.innerHTML += `<option value="${evolutionLine[nextevosOfPokemonArray.indexOf(nextevoOfPokemon) + 1 + isMiddleEvo]}" class="js-${location}-encounter-display" selected disabled hidden>${evolutionLine[nextevosOfPokemonArray.indexOf(nextevoOfPokemon) + 1 + isMiddleEvo]}</option>`;

              targetEncounterCombobox.value = evolutionLine[nextevosOfPokemonArray.indexOf(nextevoOfPokemon) + 1 + isMiddleEvo];

              document.querySelector(`.js-evolve-${location}-button`).style.display = "none";
              
              removePopupUponSelectingAnEvolution();

              checkIfFromBranchedEvolution(location);
            });

          });
        });

        // // For the exit button of the popup screen
        // addEventListenerToExitButton();
      }
    }

    addEventListenerToExitButton();

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