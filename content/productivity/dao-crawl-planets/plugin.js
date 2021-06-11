import {
  move
} from 'https://plugins.zkga.me/utils/queued-move.js';
// TODO: do we want queued move? Or some parallel stuff
import { buildUi } from 'https://dfdao.github.io/utils/ui.js'
//import { getMaxEnergyPct } from 'https://dfdao.github.io/utils/planets.js'

class Plugin {
  constructor() {
    this.minEnergyRemainingPct = { name: 'minEnergyRemainingPct', value: 25 };
    this.minPlanetLevel = { name: 'minPlanetLevel', value: 3 };
    this.crawlDirection = { name: 'crawlDirection', value: ['NE','NW','SW','SE'] };
  }
  render(container) {
    container.style.width = '200px';

    let inputs = [];
    // Create a stepper
    const minEnergyRemainingPct = {
        name: this.minEnergyRemainingPct.name,
        innerText: 'Min energy remaining pct',
        min: '0',
        max: '100',
        step: '5',
        getValueLabel: (value) => { return `${value}%`; },
        uiType: 'stepper'
    };

    const minPlanetLevel = {
        name: this.minPlanetLevel.name,
        innerText: 'Min planet capture level',
        size: 10,
        getValueLabel: (value) => { return `Level ${value}`; },
        uiType: 'dropdown'
    };

    const crawlDirection = {
        name: this.crawlDirection.name,
        innerText: 'Crawl direction',
        options: ['NE','NW','SW','SE'],
        defaultOptions: ['NE','NW','SW','SE'],
        uiType: 'checkbox'
    };

    inputs.push(minEnergyRemainingPct);
    inputs.push(minPlanetLevel);
    inputs.push(crawlDirection);

    buildUi(container, inputs, this);

    let message = document.createElement('div');

    let button = document.createElement('button');
    button.style.width = '100%';
    button.style.marginBottom = '10px';
    button.innerHTML = 'Crawl from selected!'
    button.onclick = () => {
      console.log('inputs:\n')
      console.log(this.minEnergyRemainingPct)
      console.log(this.minPlanetLevel)
      console.log(this.crawlDirection)
    }

    let globalButton = document.createElement('button');
    globalButton.style.width = '100%';
    globalButton.style.marginBottom = '10px';
    globalButton.innerHTML = 'Crawl everything!'
    globalButton.onclick = () => {
      message.innerText = 'Please wait...';

      let moves = 0;
      for (let planet of df.getMyPlanets()) {
        setTimeout(() => {
          moves += capturePlanets(
            planet.locationId,
            this.minPlanetLevel,
            this.maxEnergyPercent,
          );
          message.innerText = `Crawling ${moves} planets.`;
        }, 0);
      }
    }

    container.appendChild(button);
    container.appendChild(globalButton);
    container.appendChild(message);
  }
}

export default Plugin;


function capturePlanets(fromId, minCaptureLevel, minEnergyRemainingPct) {

  const planet = df.getPlanetWithId(fromId);
  const from = df.getPlanetWithId(fromId);
  const maxDistributeEnergyPercent = getMaxEnergyPct(from, minEnergyRemainingPct)

  // Rejected if has pending outbound moves
  const unconfirmed = df.getUnconfirmedMoves().filter(move => move.from === fromId)
  if (unconfirmed.length !== 0) {
    return;
  }

  const candidates_ = df.getPlanetsInRange(fromId, maxDistributeEnergyPercent)
    .filter(p => (
      p.owner !== df.account &&
      p.owner === "0x0000000000000000000000000000000000000000" &&
      p.planetLevel >= minCaptureLevel
    ))
    .map(to => {
      return [to, distance(from, to)]
    })
    .sort((a, b) => a[1] - b[1]);

  let i = 0;
  const energyBudget = Math.floor((maxDistributeEnergyPercent / 100) * planet.energy);

  let energySpent = 0;
  let moves = 0;
  while (energyBudget - energySpent > 0 && i < candidates_.length) {

    const energyLeft = energyBudget - energySpent;

    // Remember its a tuple of candidates and their distance
    const candidate = candidates_[i++][0];

    // Rejected if has unconfirmed pending arrivals
    const unconfirmed = df.getUnconfirmedMoves().filter(move => move.to === candidate.locationId)
    if (unconfirmed.length !== 0) {
      continue;
    }

    // Rejected if has pending arrivals
    const arrivals = getArrivalsForPlanet(candidate.locationId);
    if (arrivals.length !== 0) {
      continue;
    }

    const energyArriving = (candidate.energyCap * 0.15) + (candidate.energy * (candidate.defense / 100));
    // needs to be a whole number for the contract
    const energyNeeded = Math.ceil(df.getEnergyNeededForMove(fromId, candidate.locationId, energyArriving));
    if (energyLeft - energyNeeded < 0) {
      continue;
    }

    move(fromId, candidate.locationId, energyNeeded, 0);
    energySpent += energyNeeded;
    moves += 1;
  }

  return moves;
}

function getArrivalsForPlanet(planetId) {
  return df.getAllVoyages().filter(arrival => arrival.toPlanet === planetId).filter(p => p.arrivalTime > Date.now() / 1000);
}

//returns tuples of [planet,distance]
function distance(from, to) {
  let fromloc = from.location;
  let toloc = to.location;
  return Math.sqrt((fromloc.coords.x - toloc.coords.x) ** 2 + (fromloc.coords.y - toloc.coords.y) ** 2);
}
