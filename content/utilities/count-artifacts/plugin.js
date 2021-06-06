/**
 * Plugin:  
 * Description: 
 * 
 * 
 * Features:
 * 

 
 * Todo:
 */

import {
  canHaveArtifact,
  //hasArtifact,
  //countPlanetArtifactRarity,
} from 'https://dfdao.github.io/utils/artifacts.js';

//import { ArtifactRarity } from 'https://dfdao.github.io/utils/enums.js';
let countPlanetArtifactRarity = (planet, artifactRarity) => {
  let count = 0;
  const heldArtifactIds = planet.heldArtifactIds;
  if (heldArtifactIds) {
    for (let id of heldArtifactIds) {
      const artifact = df.entityStore.getArtifactById(id)
      artifact.rarity == artifactRarity ? count +=1 : null
    }
  }
  return count;
}

let ArtifactRarity = {
        "0": "Unknown",
        "1": "MIN",
        "2": "Rare",
        "3": "Epic",
        "4": "Legendary",
        "5": "MAX",
        "Unknown": 0,
        "Common": 1,
        "Rare": 2,
        "Epic": 3,
        "Legendary": 4,
        "Mythic": 5,
        "MIN": 1,
        "MAX": 5
};

let hasArtifact = (planet) => { return planet.heldArtifactIds.length != 0 };


console.log('imports', countPlanetArtifactRarity)

const countArtifacts = (artifactRarity) => {
  let count = 0
    df.getMyPlanets()
      .filter(hasArtifact)
      // map artifact ids -> level of artifact
      .map(p => {
        //console.log('p', p)
        count += countPlanetArtifactRarity(p, artifactRarity)
      });
  return count;
}


class Plugin {
  constructor() { }

  /**
   * Called when plugin is launched with the "run" button.
   */
  async render(container) {
    container.style.width = '200px';

    let pilotButton = document.createElement('button');
    pilotButton.innerHTML = `${'count artifacts'}`;


    pilotButton.onclick = () => {

      const count = countArtifacts(ArtifactRarity.Epic)
      pilotButton.innerHTML = `found ${count} ${ArtifactRarity[ArtifactRarity.Epic]} artifacts`;
    }

    container.appendChild(pilotButton); 
  }

  /**
   * Called when plugin modal is closed.
   */
  destroy() { 
  }

}

/**
 * And don't forget to register it!
 */
export default Plugin;
