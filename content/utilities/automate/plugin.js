/**
 * Plugin: Automate any plugin
 * Description:
 *
 *
 * Features:
 *


 * Todo:
 */

import crawlPlanets from 'http://127.0.0.1:2222/utilities/test-stepper/plugin.js?dev';
//import daoCrawlPlanets from 'http://127.0.0.1:2222/productivity/distribute-silver/plugin.js';
//console.log(`p ${defaultExport}`);

class Plugin {
  constructor() {
    this.loopId = null;

    this.c = new crawlPlanets();
    //this.d = new daoCrawlPlanets();
  }

  //run = () => {console.log('run');}

  /**
   * Called when plugin is launched with the "run" button.
   */
  async render(container) {
    this.c.run();
    this.loopId = setInterval(this.c.run, 1000);
    await this.c.render(container);
    // container.appendChild(document.createElement('br'));
    // container.appendChild(document.createTextNode('hu'));
    // container.appendChild(document.createElement('br'));
    // container.appendChild(document.createTextNode('hu'));
    //this.d.render(container);
  }

  /**
   * Called when plugin modal is closed.
   */
  destroy() {
    if (this.loopId) {
      clearInterval(this.loopId);
      df.terminal.current.println('bye bye');
    }
  }
}

/**
 * And don't forget to register it!
 */
export default Plugin;
