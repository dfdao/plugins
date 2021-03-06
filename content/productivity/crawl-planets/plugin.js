import { buildUi } from 'https://dfdao.github.io/utils/ui.js';
// Crawl Planets
//
// Capture unowned planets around you!

const PlanetType = {
    "PLANET": 0,
    "ASTEROID": 1,
    "FOUNDRY": 2,
    "RIP": 3,
    "QUASAR": 4
}

const planetTypes = {
  'Planet': 0,
  'Asteroid': 1,
  'Foundry': 2,
  'Spacetime Rip': 3,
  'Quasar': 4,
};

const MOVE_LIMIT = 50;

class Plugin {
    constructor() {
        this.minPlanetLevel = 3;
        this.maxEnergyPercent = 85;
    }
    render(container) {
        container.style.width = '200px';

        let stepperLabel = document.createElement('label');
        stepperLabel.innerText = 'Max % energy to spend';
        stepperLabel.style.display = 'block';

        let stepper = document.createElement('input');
        stepper.type = 'range';
        stepper.min = '0';
        stepper.max = '100';
        stepper.step = '5';
        stepper.value = `${this.maxEnergyPercent}`;
        stepper.style.width = '80%';
        stepper.style.height = '24px';

        let percent = document.createElement('span');
        percent.innerText = `${stepper.value}%`;
        percent.style.float = 'right';

        stepper.onchange = (evt) => {
            percent.innerText = `${evt.target.value}%`;
            try {
                this.maxEnergyPercent = parseInt(evt.target.value, 10);
            } catch (e) {
                console.error('could not parse energy percent', e);
            }
        };

        let levelLabel = document.createElement('label');
        levelLabel.innerText = 'Min. planets to capture';
        levelLabel.style.display = 'block';

        let level = document.createElement('select');
        level.style.background = 'rgb(8,8,8)';
        level.style.width = '100%';
        level.style.marginTop = '10px';
        level.style.marginBottom = '10px';
        [0, 1, 2, 3, 4, 5, 6, 7].forEach(lvl => {
            let opt = document.createElement('option');
            opt.value = `${lvl}`;
            opt.innerText = `Level ${lvl}`;
            level.appendChild(opt);
        });
        level.value = `${this.minPlanetLevel}`;

        level.onchange = (evt) => {
            try {
                this.minPlanetLevel = parseInt(evt.target.value);
            } catch (e) {
                console.error('could not parse planet level', e);
            }
        };

        let message = document.createElement('div');
        this.message = message;

        let button = document.createElement('button');
        button.style.width = '100%';
        button.style.marginBottom = '10px';
        button.innerHTML = 'Crawl from selected!';
        button.onclick = () => {
            let planet = ui.getSelectedPlanet();
            if (planet) {
                message.innerText = 'Please wait...';
                let moves = daoCapturePlanets(
                    planet.locationId,
                    this.minPlanetLevel,
                    this.maxEnergyPercent,
                );
                message.innerText = `Crawling ${moves} planets.`;
            } else {
                message.innerText = 'No planet selected.';
            }
        };

        let globalButton = document.createElement('button');
        globalButton.style.width = '100%';
        globalButton.style.marginBottom = '10px';
        globalButton.innerHTML = 'Crawl everything!';
        globalButton.onclick = () => {
            message.innerText = 'Please wait...';

            let moves = 0;
            for (let planet of df.getMyPlanets()) {
                setTimeout(() => {
                    moves += daoCapturePlanets(
                        planet.locationId,
                        this.minPlanetLevel,
                        this.maxEnergyPercent,

                    );
                    message.innerText = `Crawling ${moves} planets.`;
                }, 0);
            }
        };

        container.appendChild(stepperLabel);
        container.appendChild(stepper);
        container.appendChild(percent);
        container.appendChild(levelLabel);
        container.appendChild(level);
        container.appendChild(button);
        container.appendChild(globalButton);
        container.appendChild(message);
    }
    destroy (){
      console.log(`destroying base plugin`);
    }
}

class RemotePlugin extends Plugin {
    constructor() {
        super();

        this.timers = [];
        this.crawlTimerDuration = 1 * 60 * 1000; // in ms

        // This is the max level which will crawl for planets
        this.maxPlanetLevel = { name: 'maxPlanetLevel', value: 4 };
    }

    render(container) {
        super.render(container);

        let dfdao = document.createElement('div');
        dfdao.innerText = 'dfdao additions:\n';

        let remoteWrapper = document.createElement('div');
        // remoteWrapper.style.display = 'flex'; // this doesn't allow vertical appending
        remoteWrapper.style.justifyContent = 'space-between';
        remoteWrapper.style.marginBottom = '10px';


        let inputs = [];
        const maxPlanetLevel = {
            name: this.maxPlanetLevel.name,
            innerText: 'Max planet send level',
            size: 7,
            getValueLabel: (value) => { return `Level ${value}`; },
            uiType: 'dropdown'
        };

        inputs.push(maxPlanetLevel);



        let everythingLoopButton = document.createElement('button');
        everythingLoopButton.style.width = '100%';
        everythingLoopButton.style.marginBottom = '10px';
        everythingLoopButton.innerHTML = 'Crawl everything in a loop!';
        everythingLoopButton.onclick = () => {
            this.loopCrawlEverything();
        };

        remoteWrapper.appendChild(document.createElement('break'));
        remoteWrapper.appendChild(dfdao);
        remoteWrapper.appendChild(document.createElement('break'));

        buildUi(remoteWrapper, inputs, this);
        remoteWrapper.appendChild(everythingLoopButton);

        container.appendChild(remoteWrapper);
    }

    crawlEverything() {
        this.message.innerText = 'Please wait...';
        console.log("crawling everything from a loop");
        let moves = 0;
        for (let planet of df.getMyPlanets()) {
            setTimeout(() => {
                if (moves < MOVE_LIMIT) {
                    moves += daoCapturePlanets(
                        planet.locationId,
                        this.minPlanetLevel,
                        this.maxEnergyPercent,
                        this.maxPlanetLevel.value,
                    );
                    this.message.innerText = `Crawling ${moves} planets.`;
                }
            }, 0);
        }
    }

    loopCrawlEverything() {
        this.crawlEverything();

        console.log("setting up a crawl everything loop");
        this.timers.push(
            setInterval(this.crawlEverything.bind(this), this.crawlTimerDuration)
        );
    }

    destroy() {
        console.log(`destroying ${this.timers.length} timers`);
        for(let timer of this.timers) {
            clearInterval(timer);
        }

        super.destroy();
    }
}

export default RemotePlugin;


function capturePlanets(fromId, minCaptureLevel, maxDistributeEnergyPercent) {
    const planet = df.getPlanetWithId(fromId);
    const from = df.getPlanetWithId(fromId);
    // Rejected if has pending outbound moves
    const unconfirmed = df.getUnconfirmedMoves().filter(move => move.from === fromId);
    if (unconfirmed.length !== 0) {
        return 0;
    }

    const candidates_ = df.getPlanetsInRange(fromId, maxDistributeEnergyPercent)
        .filter(p => (
            p.owner !== df.account &&
            p.owner === "0x0000000000000000000000000000000000000000" &&
            p.planetLevel >= minCaptureLevel &&
            p.planetType !== PlanetType.QUASAR // don't crawl quasars
        ))
        .map(to => {
            return [to, distance(from, to)];
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
        const unconfirmed = df.getUnconfirmedMoves().filter(move => move.to === candidate.locationId);
        if (unconfirmed.length !== 0) {
            continue;
        }

        // Rejected if has pending arrivals
        const arrivals = getArrivalsForPlanet(candidate.locationId);
        if (arrivals.length !== 0) {
            continue;
        }

        // still not sure why this formula is right
        const energyArriving = (candidate.energyCap * 0.15) + (candidate.energy * (candidate.defense / 100));

        // needs to be a whole number for the contract
        const energyNeeded = Math.ceil(df.getEnergyNeededForMove(fromId, candidate.locationId, energyArriving));
        if (energyLeft - energyNeeded < 0) {
            continue;
        }

        df.move(fromId, candidate.locationId, energyNeeded, 0);
        energySpent += energyNeeded;
        moves += 1;
    }

    return moves;
}

function daoCapturePlanets(fromId, minCaptureLevel, maxDistributeEnergyPercent, maxPlanetLevel = 4) {
  const from = df.getPlanetWithId(fromId);

  // filter to not crawl from larger planets
  if (from.planetLevel > maxPlanetLevel) {
      return 0;
  }

  // Don't crawl from asteroids
  if (from.planetType == PlanetType.ASTEROID) {
      return 0;
  }

  return capturePlanets(
      from.locationId,
      minCaptureLevel,
      maxDistributeEnergyPercent,
  );
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
