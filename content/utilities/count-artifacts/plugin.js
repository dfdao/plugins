/**
 * Plugin:
 * Description:
 *  Not working right now
 *
 * Features:
 *


 * Todo:
 */

import {
    canHaveArtifact,
    hasArtifact,
    countPlanetArtifactRarity,
} from 'https://dfdao.github.io/utils/artifacts.js';

import * as ENUMS from 'https://dfdao.github.io/utils/enums.js';

console.log('enums', ENUMS)

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

            const epic = ArtifactRarity.Epic
            const mythic = ArtifactRarity.Mythic
            const legendary = ArtifactRarity.Legendary
            const count = countArtifacts(mythic)
            pilotButton.innerHTML = `found ${count} ${ArtifactRarity[legendary]} artifacts`;
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