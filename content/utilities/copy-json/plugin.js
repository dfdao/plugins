/**
 * Plugin:  copy JSON
 * Description: copy JSON of selected planet to clipboard
 */

const { getPlanetName } = df.getProcgenUtils();


class Plugin {
  constructor() {}

  /**
   * Called when plugin is launched with the "run" button.
   */
  async render(container) {
    container.style.width = 'auto';

    // Make element 
    var input = document.createElement("input");
    input.type = "text";
    input.id = "planet";
    input.value = 'temp';
    console.log('input element is ', input) 
    let copyButton = document.createElement('button');

    let selected;

    // will run when select changes.
    const unsubscribe = ui.selectedPlanetId$.subscribe(locationId => {
      selected = df.getPlanetWithId(locationId);
      if (selected) {
        df.terminal.current.println(`selected is ${selected}`)
        const name = getPlanetName(selected);
        copyButton.innerHTML = `Copy ${name}`
      }
      else {
        copyButton.innerHTML = `select a planet to begin`
      }
    })

        
    copyButton.onclick = () => { 
    // Grab selected planet from the UI
    
      df.terminal.current.println(`currently selected planet: ${name}`)

      // Update button with planet info
      if (selected) {
        // Set input value to planet object
        input.value = JSON.stringify(selected);
        let copy = document.getElementById('planet')
        copy.select()
        document.execCommand("copy");
        console.log('copied', selected)
        copyButton.innerHTML = `Copied ${name} to clipboard:`
        df.terminal.current.println(`copied: ${name}`);

      } else {
        df.terminal.current.println(`can't copy before selecting`);
      }
    }

    container.appendChild(copyButton);
    container.appendChild(input);

  }

  /**
   * Called when plugin modal is closed.
   */
  destroy() {}
}

export default Plugin;
