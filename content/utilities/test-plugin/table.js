/**
 * Plugin:
 * Description:
 *
 *
 * Features:
 *


 * Todo:
 */

import {buildButton} from 'http://127.0.0.1:2222/utilities/ui.js?x=5';

// table data structure
/**
  [
    {
      head1: htmlNode
      head2: htmlNode
    },
    {
      ...
    }
  ]
*/

// items is a list of objects
function GenerateTable(items) {
  //Build headers

  var headers = Object.keys(items[0]);

  //Create a HTML Table element.
  var table1 = document.createElement("div");
  //table.border = "1";
  table1.style.maxHeight = `100px`;
  table1.style.width = `auto`;
  table1.style.overflowY="scroll";

  var table = document.createElement("table");
  //table.style.borderCollapse="collapse";

  //Get the count of columns.

  //Add the header row.
  var head = table.insertRow(-1);
  head.style.color = 'green';
  head.style.top = '0px';
  head.style.position = 'sticky';
  for (let h of headers) {
    // const myButton = {
    //  innerHTML: h,
    //  onClick: () => {
    //    alert('inputs:\n');
    //  },
    //   uiType: 'button'
    // };
    var th = document.createElement("th");
    th.innerHTML = h;
    head.appendChild(th);
  }

  //Add the data rows.
  for (let item of items) {
    var tr = document.createElement("tr");
    for (const [key, value] of Object.entries(item)) {
      var td = document.createElement('td');
      var textnode = document.createTextNode("Water");
      console.log('value', value);
      td.appendChild(textnode);
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
  table1.appendChild(table);
  return table1;
}

class Plugin {
constructor() { }

/**
 * Called when plugin is launched with the "run" button.
 */
async render(container) {
  var textnode = document.createTextNode("Tony");
  var textnode1 = document.createTextNode("Maya");
  var items = [
    {from: textnode, to: textnode1},
    {from: textnode, to: textnode1},
  ];
  let table = GenerateTable(items);
  console.log(table);
  container.appendChild(table);
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
