// Send rips to colossus!
// note that you must load the Colossus plug-in before running this!
import {
  PlanetType,
  PlanetLevel,
  PlanetLevelNames,
} from "https://cdn.skypack.dev/@darkforest_eth/types"

class Plugin {
  constructor() {
    this.maxEnergyPercent = 85;
    this.minPlanetLevel = 3;
    this.maxAsteroidLevel = 2;
  }
  render(container) {
    container.style.width = '200px';

    let message = document.createElement('div');

    let withdrawtButton = document.createElement('button');
    withdrawtButton.style.width = '100%';
    withdrawtButton.style.marginBottom = '10px';
    withdrawtButton.innerHTML = 'Withdraw from 5 largest space rifts';
    withdrawtButton.onclick = () => {
      message.innerText = 'Please wait...';

      let rips = df.getMyPlanets().filter(isSpaceRift);
      rips = rips.sort((p1, p2) => p1.silver > p2.silver);
      rips = rips.slice(0,5); 
      console.log(`rips to send`, rips)
      window.Colossus.handleWithdrawAndReturn(rips);

      message.innerText = `Withdrawing silver for Colossus.`;
    }

    container.appendChild(withdrawtButton);
    container.appendChild(message);

  }
}
function isSpaceRift(planet) {
  return planet.planetType === PlanetType.TRADING_POST;
}


export default Plugin;
