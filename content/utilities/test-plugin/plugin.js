/**
 * Plugin:  test Plugin
 * Description: copy JSON of selected planet to clipboard
 */

const { getPlanetName } = df.getProcgenUtils();
let r = Math.random().toString(36).substring(7);

import { buildUi } from 'http://127.0.0.1:2222/utilities/ui.js?x=5';

console.log(`buildUi ${buildUi}`);

class Plugin {
  constructor() {
    this.minEnergyRemainingPct = { name: 'minEnergyRemainingPct', value: 25 };
    this.minPlanetLevel = { name: 'minPlanetLevel', value: 3 };
    this.crawlDirection = { name: 'crawlDirection', value: ['NE','NW','SW','SE']};
    this.myRadio = {name: 'myRadio', value: ''}; //value == '' || something from options

    // inputs could also be in constructor
    this.inputs = [];
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
        options: ['NX','NW','SW','SE'],
        defaultOptions: this.crawlDirection.value,
        uiType: 'checkbox'
    };

    const myRadio = {
        name: this.myRadio.name,
        innerText: 'Radio test',
        options: ['NE','NW','SW','SE'],
        default: this.myRadio.value,
        uiType: 'radio'
    };

    const myButton = {
      innerHTML: 'log inputs',
      onClick: () => {
        console.log('inputs:\n');
        console.log(this.minEnergyRemainingPct);
        console.log(this.minPlanetLevel);
        console.log(this.crawlDirection);
        console.log(this.myRadio);
      },
      uiType: 'button'
    };

    this.inputs.push(minEnergyRemainingPct);
    this.inputs.push(minPlanetLevel);
    this.inputs.push(crawlDirection);
    this.inputs.push(myRadio);
    this.inputs.push(myButton);
  }
  render(container) {
    container.style.width = '200px';

    console.log(this.inputs);
    buildUi(container, this.inputs, this);

    let message = document.createElement('div');

  }

  /**
   * Called when plugin modal is closed.
   */
  destroy() {}
}

export default Plugin;
