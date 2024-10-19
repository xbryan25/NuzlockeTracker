

export default async function getEvolutionLine(pokemon){
  //  The goal of this function is to return an array that contains the evolution chain of the given pokemon
  let pokemonInfoResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
  let pokemonInfoResponseJSON = await pokemonInfoResponse.json();
  let getSpeciesLink = pokemonInfoResponseJSON ['species']['url'];
  
  let pokemonSpeciesResponse = await fetch(`${getSpeciesLink}`);
  let pokemonSpeciesResponseJSON = await pokemonSpeciesResponse.json();
  let getEvolutionChainLink = pokemonSpeciesResponseJSON['evolution_chain']['url'];

  let pokemonEvolutionChainResponse = await fetch(`${getEvolutionChainLink}`);
  let pokemonEvolutionChainResponseJSON = await pokemonEvolutionChainResponse.json();

  // pokemonEvolutionChain can also be called baseEvolution
  let pokemonEvolutionChain = pokemonEvolutionChainResponseJSON['chain']

  let evolutionLine = [];

  // base evolution (not done in a loop because pokemonEvolutionChain is not iterable)
  evolutionLine.push(pokemonEvolutionChain['species']['name']);

  if (pokemonEvolutionChain['evolves_to'].length !== 0){

    // second evolution
    let secondEvolutions = pokemonEvolutionChain['evolves_to'];

    secondEvolutions.forEach(secondEvolution => {
      evolutionLine.push(secondEvolution['species']['name']);

      if (secondEvolution['evolves_to'].length !== 0){
        let third_evolutions = secondEvolution['evolves_to'];

        third_evolutions.forEach(third_evolution => {
          evolutionLine.push(third_evolution['species']['name']);
        });

        // Only stop at third evolution because pokemon can only have two evolutions at maximum 
      }
    });
  }


  // for (let evolution of evolutionLine){
  //   titleCaseEvolutionLine.push(evolution.charAt(0).toUpperCase() + evolution.slice(1));
  // }

  let titleCaseEvolutionLine = evolutionLine.map(evolution => {
                                return evolution.charAt(0).toUpperCase() + evolution.slice(1);
                              });

  return titleCaseEvolutionLine;
}