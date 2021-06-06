/**
 * Plugin:  
 * Description: 
 * 
 * 
 * Features:
 * Runs prospect and find on selected planet

 
 * Todo:
 */

const { getPlanetName } = df.getProcgenUtils();

const prospectAndFind = async (planet) => {
    console.log(`prospecting ${getPlanetName(planet)}`)
    const result = await df.prospectPlanet(planet.locationId);
    console.log('prospect has returned', result)
    df.findArtifact(planet.locationId); 
}




class Plugin {
  constructor() { }

  /**
   * Called when plugin is launched with the "run" button.
   */
  async render(container) {
    const unsubscribe = ui.selectedPlanetId$.subscribe(locationId => {
      const planet = df.getPlanetWithId(locationId)
      prospectAndFind(locationId);
    }) 
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
