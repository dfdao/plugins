/**
 * Plugin:  test Plugin
 * Description: copy JSON of selected planet to clipboard
 */

const { getPlanetName } = df.getProcgenUtils();
let r = Math.random().toString(36).substring(7);

import { buildUi } from 'http://127.0.0.1:2222/utilities/ui.js?x=44'; // replace with hosted ui
import { getPlanetType } from 'http://127.0.0.1:2222/utilities/constants.js?x=11'; // replace with hosted constants
const PlanetType = getPlanetType();

/**
  for (obj in inputs) {
    this[obj.name] = obj
    this.inputs.push(obj);
  }
*/

const logInputs = (inputs) => {
  console.log(`inputs`, inputs);
  for (let i of inputs) {
    console.log(`${i.name}: ${i.value}`);
  }
};

const baseValueLabel = (value) => `${value}`;

class Plugin {
  constructor() {
    // inputs are variables that store user input
    // nodes are for ui display
    this.inputs = [];
    this.nodes = [];

    // Create a stepper
    this.fromMinEnergyRemainingPct = {
        name: 'fromMinEnergyRemainingPct',
        innerText: 'Min energy remaining pct',
        value: 25,
        min: '0',
        max: '100',
        step: '5',
        getValueLabel: (value) => { return `${value}%`; },
        uiType: 'stepper'
    };

    this.fromMinPlanetLevel = {
        name: 'fromMinPlanetLevel',
        innerText: 'Min level ',
        value: 3,
        size: 10,
        getValueLabel: baseValueLabel,
        uiType: 'dropdown',
        parentType: 'span'
    };

    this.fromMaxPlanetLevel = {
        name: 'fromMaxPlanetLevel',
        innerText: 'Max level ',
        value: 3,
        size: 10,
        getValueLabel: baseValueLabel,
        uiType: 'dropdown',
        parentType: 'span'
    };

    this.toMinPlanetLevel = {
        name: 'toMinPlanetLevel',
        innerText: 'Min level ',
        value: 3,
        size: 10,
        getValueLabel: baseValueLabel,
        uiType: 'dropdown',
        parentType: 'span'
    };

    this.toMaxPlanetLevel = {
        name: 'toMaxPlanetLevel',
        innerText: 'Max level ',
        value: 3,
        size: 10,
        getValueLabel: baseValueLabel,
        uiType: 'dropdown',
        parentType: 'span'
    };

    this.fromPlanetTypes = {
        name: 'fromPlanetTypes',
        innerText: 'Planet Types',
        value: [],
        options: [0,1,2,3,4],
        getValueLabel: (value) => { return `${PlanetType[value]}`; },
        uiType: 'checkbox'
    };

    this.toPlanetTypes = {
        name: 'toPlanetTypes',
        innerText: 'Planet Types',
        value: [],
        options: [0,1,2,3,4],
        getValueLabel: (value) => { return `${PlanetType[value]}`; },
        uiType: 'checkbox'
    };

    // this.myRadio = {
    //     name: 'myRadio',
    //     innerText: 'Radio test',
    //     value: 'SE',
    //     options: ['NE','NW','SW','SE'],
    //     uiType: 'radio'
    // };

    this.presetName = {
        name: 'presetName',
        innerText: 'Name your template: ',
        value: '',
        uiType: 'input'
    };

    this.inputs = [
      this.fromMinEnergyRemainingPct,
      this.fromMinPlanetLevel,
      this.toMinPlanetLevel,
      this.fromPlanetTypes,
      this.toPlanetTypes,
      this.presetName,
    ];

    this.br = {
      uiType: 'break'
    };

    const logButton = {
      innerHTML: 'log inputs',
      onClick: () => {
        logInputs(this.inputs);
      },
      uiType: 'button'
    };

    const saveButton = {
      innerHTML: 'save as',
      onClick: () => {
        const val = document.getElementById(this.presetName.innerText).value;
        this.presetName.value = val;
      },
      uiType: 'button'
    };

    const inputSpan = {
      spanList: [
        this.presetName,
        saveButton
      ],
      uiType: 'span'
    };

    // nodes for columns
    const node1 = [
      this.fromMinPlanetLevel,
      this.fromMaxPlanetLevel,
      this.fromPlanetTypes,
      this.fromMinEnergyRemainingPct
    ];

    const node2 = [
      this.toMinPlanetLevel,
      this.toMaxPlanetLevel,
      this.toPlanetTypes,
    ];

    const myCols = {
      headers: ['from', 'to'],
      nodes: [node1, node2],
      uiType: 'column'
    };

    this.myTable = {
      innerHTML: 'my Table',
      items: [
        {
          from: 'a',
          to: 'b'
        },
        {
          from: 'a',
          to: 'b'
        },
      ],
      dataType: 'json',
      uiType: 'table'
    };

    // Put nodes that don't need access to the outer container here
    this.nodes = [
      logButton,
      myCols,
      inputSpan,
    ];

  }
  render(container) {
    container.style.width = 'auto';

    console.log(this.inputs);

    // needs access to container to append table on click
    const previewButton = {
      innerHTML: 'Preview move(s)',
      onClick: () => {
        console.log('here is my table');
        buildUi(container, [this.myTable]);
      },
      uiType: 'button'
    };

    const crawlButton = {
      innerHTML: 'Crawl baby crawl',
      onClick: () => {
        // console.log('here is my table');
        // buildUi(container, [this.myTable]);
      },
      uiType: 'button'
    };


    this.nodes.push(previewButton);
    this.nodes.push(this.br);
    this.nodes.push(crawlButton);

    buildUi(container, this.nodes);


    console.log(`container \n`, container);
  }

  /**
   * Called when plugin modal is closed.
   */
  destroy() {}
}

export default Plugin;
