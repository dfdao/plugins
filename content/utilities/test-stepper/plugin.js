/**
 * Plugin:
 * Description:
 *
 *
 * Features:
 *

 
 * Todo:
 */
import { buildUi } from 'https://dfdao.github.io/utils/ui.js';
import { uiElts } from 'https://dfdao.github.io/utils/utils.js';
console.log('uiElts', uiElts );
class Plugin {
    constructor() {
        this.minSilver = { name: 'minSilver', value: 20000 };
        this.minPlanetLevel = { name: 'minPlanetLevel', value: 3 };
    }
    /**
     * Called when plugin is launched with the "run" button.
     */
    async render(container) {
        let inputs = [];
        // Create a stepper
        const minSilver = {
            name: this.minSilver.name,
            innerText: 'Test stepper',
            min: '0',
            max: '100000',
            step: '10000',
            getValueLabel: (value) => { return `${value / 1000}k`; },
            uiType: 'stepper'
        };
        const minPlanetLevel = {
            name: this.minPlanetLevel.name,
            innerText: 'Test dropdown',
            size: 10,
            getValueLabel: (value) => { return `Level ${value}`; },
            uiType: 'dropdown'
        };
        inputs.push(minSilver);
        inputs.push(minPlanetLevel);
        buildUi(container, inputs, this);
        let pilotButton = document.createElement('button');
        pilotButton.innerHTML = `${'console log value'}`;
        pilotButton.onclick = () => {
            console.log('minPlanetLevel is ', this.minPlanetLevel);
            console.log('minSilveLevel is ', this.minSilver);
        };
        container.appendChild(pilotButton);
    }
    /**
     * Called when plugin modal is closed.
     */
    destroy() { }
}
/**
 * And don't forget to register it!
 */
export default Plugin;
