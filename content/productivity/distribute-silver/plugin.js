// Distribute Silver
//
// Distribute your silver!

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

    let withdrawtButton = document.createElement('button');
    withdrawtButton.style.width = '100%';
    withdrawtButton.style.marginBottom = '10px';
    withdrawtButton.innerHTML = 'Withdraw from 5 largest space rifts';
    withdrawtButton.onclick = () => {
      message.innerText = 'Please wait...';

      let rips = df.getMyPlanets().filter(isSpaceRift);
      rips = rips.sort((p1, p2) => p1.silver > p2.silver);
      rips = rips.slice(0,5); 
      window.Colossus.handleWithdrawAndReturn(rips);

      message.innerText = `Withdrawing silver for Colossus.`;
    }

    container.appendChild(stepperLabel);
    container.appendChild(stepper);
    container.appendChild(percent);
    container.appendChild(levelLabel);
    container.appendChild(level);
    container.appendChild(levelAsteroidLabel);
    container.appendChild(levelAsteroid);
    container.appendChild(button);
    container.appendChild(asteroidButton);
    container.appendChild(toSpaceRiftButton);
    container.appendChild(withdrawtButton);
    container.appendChild(message);
  }
}

function withdrawSilver(fromId) {
  const from = df.getPlanetWithId(fromId);
  const silver = Math.floor(from.silver);
  if (silver === 0) {
    return 0;
  }
  df.withdrawSilver(fromId, silver);
  return silver;
}

function toPlanetOrSpaceRift(planet, toSpaceRift) {
  return toSpaceRift ? isSpaceRift(planet) : isPlanet(planet);
}

function distributeSilver(fromId, maxDistributeEnergyPercent, minPLevel, toSpaceRift) {
  const from = df.getPlanetWithId(fromId);
  const silverBudget = Math.floor(from.silver);

  // we ignore 50 silvers or less
  if (silverBudget < 50) {
    return 0;
  }
  const candidates_ = df.getPlanetsInRange(fromId, maxDistributeEnergyPercent)
    .filter(p => p.owner === df.getAccount()) //get player planets
    .filter(p => toPlanetOrSpaceRift(p, toSpaceRift)) // filer planet or space rift
    .filter(p => p.planetLevel >= minPLevel) // filer level
    .map(to => [to, distance(from, to)])
    .sort((a, b) => a[1] - b[1]);


  let i = 0;
  const energyBudget = Math.floor((maxDistributeEnergyPercent / 100) * from.energy);

  let energySpent = 0;
  let silverSpent = 0;
  let moves = 0;
  while (energyBudget - energySpent > 0 && i < candidates_.length) {

    const silverLeft = silverBudget - silverSpent;
    const energyLeft = energyBudget - energySpent;

    // Remember its a tuple of candidates and their distance
    const candidate = candidates_[i++][0];

    // Rejected if has more than 5 pending arrivals. Transactions are reverted when more arrives. You can't increase it
    const unconfirmed = df.getUnconfirmedMoves().filter(move => move.to === candidate.locationId)
    const arrivals = getArrivalsForPlanet(candidate.locationId);
    if (unconfirmed.length + arrivals.length > 4) {
      continue;
    }

    const silverRequested = Math.ceil(candidate.silverCap - candidate.silver);
    const silverNeeded = silverRequested > silverLeft ? silverLeft : silverRequested;


    // Setting a 100 silver guard here, but we could set this to 0
    if (silverNeeded < 100) {
      continue;
    }

    // needs to be a whole number for the contract
    const energyNeeded = Math.ceil(df.getEnergyNeededForMove(fromId, candidate.locationId, 1));
    if (energyLeft - energyNeeded < 0) {
      continue;
    }

    df.move(fromId, candidate.locationId, energyNeeded, silverNeeded);
    energySpent += energyNeeded;
    silverSpent += silverNeeded;
    moves += 1;
  }

  return moves;
}

function isAsteroid(planet) {
  return planet.planetType === PlanetType.SILVER_MINE;
}

function isPlanet(planet) {
  return planet.planetType === PlanetType.PLANET;
}

function isSpaceRift(planet) {
  return planet.planetType === PlanetType.TRADING_POST;
}

//returns tuples of [planet,distance]
function distance(from, to) {
  let fromloc = from.location;
  let toloc = to.location;
  return Math.sqrt((fromloc.coords.x - toloc.coords.x) ** 2 + (fromloc.coords.y - toloc.coords.y) ** 2);
}

function getArrivalsForPlanet(planetId) {
  return df.getAllVoyages().filter(arrival => arrival.toPlanet === planetId).filter(p => p.arrivalTime > Date.now() / 1000);
}

export default Plugin;
