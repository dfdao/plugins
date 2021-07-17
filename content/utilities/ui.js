/**
     EXAMPLE:

     See generalize move plugin for use case of UI

 */

/**
* Helpers
*/

const getValues = (div) => {
   var boxes = div.getElementsByTagName('input');
   var vals = [];
   for(let b of boxes){
     b.checked ? vals.push(b.value) : null ;
   }
   return vals;
};
const isInDefault = (option, defaults) => { return defaults.includes(option);};

const isEmpty = (array) => {
    //If it's not an array, return FALSE.
    if (!Array.isArray(array)) {
        return false;
    }
    //If it is an array, check its length property
    if (array.length == 0) {
        //Return TRUE if the array is empty
        return true;
    }
    //Otherwise, return FALSE.
    return false;
};

// rowStyle and colStyle are for the buildTwoColumn function
const rowStyle = (row) => {
  const style = document.createElement('style');

  // append to DOM
  document.head.appendChild(style);

  // insert CSS Rule
  style.sheet.insertRule(`
    .row:after {
      content: "";
      display: table;
      clear: both;
    }
  `);
  console.log(`style sheet`, style.sheet);
};

const colStyle = (col) => {
  col.style.float = 'left';
  col.style.width ='50%';
  col.style.padding = '10px';
};

/**
* Basic level components (stepper, dropdown, radio, etc)
* Each component returns an array of HTML Nodes
*/

export const buildStepper = (stepObj) => {
    const name = stepObj.name;
    const getValueLabel = stepObj.getValueLabel;
    let stepperLabel = document.createElement('label');
    stepperLabel.innerText = stepObj.innerText;
    // stepperLabel.style.display = 'block';
    let stepper = document.createElement('input');
    stepper.type = 'range';
    stepper.min = stepObj.min;
    stepper.max = stepObj.max;
    stepper.step = stepObj.step;
    stepper.value = stepObj.value;
    stepper.style.width = '80%';
    stepper.style.height = '24px';
    let stepperValue = document.createElement('span');
    stepperValue.innerText = `${getValueLabel(stepper.value)}`;
    stepperValue.style.float = 'right';
    stepper.onchange = (evt) => {
        stepperValue.innerText = `${getValueLabel(evt.target.value)}`;
        try {
            // update of class object
            stepObj.value = parseInt(evt.target.value, 10); // assuming values are integers
        }
        catch (e) {
            console.error(`could not parse ${name}`, e);
        }
    };
    return [stepperLabel, stepper, stepperValue];
};

export const buildRadio = (value, name, checked, onClick) => {
    var radio = document.createElement('input');
    radio.type = "radio";
    radio.name = name;
    radio.onclick = onClick;
    radio.id = value;
    radio.value = value;
    checked ? radio.checked = true : null;
    return radio;
};

// TODO: defaults for radio
export const buildRadios = (radioObj) => {
    const radioGroup = document.createElement('div');
    const name = radioObj.name;
    //const getValueLabel = radioObj.getValueLabel;
    let radioLabel = document.createElement('label');
    radioLabel.innerText = radioObj.innerText;
    // radioLabel.style.display = 'block';
    const onClick = (evt) => {
      console.log('evt', evt.target.value);
      //console.log(evt);
      radioObj.value = evt.target.value;
      console.log('new val', radioObj.value);
    };
    const radioList = radioObj.options;
    for (let r of radioList) {
      df.terminal.current.println(`r ${r}`);
      const checked = isInDefault(r, radioObj.value);
      var radio = buildRadio(r, name, checked, onClick);
      let label = document.createElement('label');
      label.for = r;
      label.innerText = r;
      radioGroup.appendChild(radio);
      radioGroup.appendChild(label);
      var br = document.createElement('br');
      radioGroup.appendChild(br);
    }
    return [radioLabel, radioGroup];
  };

export const buildDropdown = (dropObj) => {
    const getValueLabel = dropObj.getValueLabel;
    const name = dropObj['name'];
    let levelLabel = document.createElement('label');
    levelLabel.innerText = dropObj.innerText;
    // levelLabel.style.display = 'block';
    let level = document.createElement('select');
    level.style.background = 'rgb(8,8,8)';
    // level.style.width = '100%';
    level.style.marginTop = '10px';
    level.style.marginBottom = '10px';
    Array.from(Array(dropObj.size).keys()).forEach(lvl => {
        let opt = document.createElement('option');
        opt.value = `${lvl}`;
        opt.innerText = `${getValueLabel(lvl)}`;
        level.appendChild(opt);
    });
    level.value = `${dropObj.value}`;
    level.onchange = (evt) => {
        try {
            dropObj.value = parseInt(evt.target.value, 10);
        }
        catch (e) {
            console.error(`could not parse ${name}`, e);
        }
    };
    return [levelLabel, level];
};

export const buildCheckbox = (value, checked, onClick) => {
    var checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.onclick = onClick;
    checkbox.id = value;
    checkbox.value = value;
    checked ? checkbox.checked = true : null;
    return checkbox;
};

export const buildCheckboxes = (checkObj) => {
  const name = checkObj.name;
  const checkbox = document.createElement('div');
  let checkboxLabel = document.createElement('label');
  const onClick = (evt) => {
    checkObj.value = getValues(checkbox);
    // console.log(`new val ${classObj[name].value}`)
  };

  checkboxLabel.innerText = checkObj.innerText;
  const options = checkObj['options'];
  options.forEach(o => {
    var label = document.createElement('label');
    var br = document.createElement('br');
    const checked = isInDefault(o, checkObj.value);
    label.appendChild(buildCheckbox(o, checked, onClick));
    let checkLabel = o;
    if ('getValueLabel' in checkObj) {
      checkLabel = checkObj.getValueLabel(o);
    }
    label.appendChild(document.createTextNode(checkLabel));
    label.appendChild(br);
    checkbox.appendChild(label);
  });

  return [checkboxLabel, checkbox];
};

export const buildButton = (buttonObj) => {
  let button = document.createElement('button');
  //button.style.width = '100%';
  button.style.marginBottom = '10px';
  button.innerHTML = buttonObj['innerHTML'];
  button.onclick = buttonObj['onClick'];
  return [button];
};

// table items is a list of objects with the following structure:
// table data structure
/**
  [
    {
      head1: htmlNode || string,
      head2: htmlNode || string,
      ...
    },
    {
      ...
    }
  ]
*/

export const buildTable = (tableObj) => {
  const items = tableObj.items;
  const type = tableObj.dataType; // json or htmlNode

  console.log(items[0]);
  //Build headers
  var headers = Object.keys(items[0]);

  //Create a HTML Table element.
  var table1 = document.createElement("div");

  table1.style.maxHeight = `400px`;
  table1.style.width = `auto`;
  table1.style.overflowY="scroll";

  var table = document.createElement("table");
  table.style.border = "2px solid #ffffff";
  table.style.borderSpacing = '15px 0px';
  table.style.width = '100%';

  //Get the count of columns.

  //Add the header row.
  var head = table.insertRow(-1);
  // want header row to be sticky
  // head.style.top = '0px';
  head.style.position = 'sticky';

  head.style.color = 'green';
  for (let h of headers) {
    // const myButton = {
    //  innerHTML: h,
    //  onClick: () => {
    //    alert('inputs:\n');
    //  },
    //   uiType: 'button'
    // };
    var th = document.createElement("th");
    th.style.border = "2px solid #ffffff";

    th.innerHTML = h;
    head.appendChild(th);
  }

  //Add the data rows.
  for (let item of items) {
    var tr = document.createElement("tr");
    tr.style.border = "2px solid #ffffff";
    for (const [key, value] of Object.entries(item)) {
      console.log(`${key}: ${value}`);
      var td = document.createElement('td');
      td.style.border = "2px solid #ffffff";
      if (type == 'json') {
        td.appendChild(document.createTextNode(value));
      }
      else if (type == 'htmlNode') {
        // validate that each value is a nodeType
        if (value.nodeType > 0) {
          td.appendChild(value);
        }
        else {
          var error = document.createTextNode(`${value} is not a node type`);
          td.appendChild(error);
        }
      }
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
  table1.appendChild(table);
  return [table1];

};

export const buildInput = (inputObj) => {
  let label = document.createElement('label');
  label.for = inputObj.innerText;
  label.innerText = inputObj.innerText;
  let input = document.createElement('input');
  input.type = 'text';
  input.id = inputObj.innerText;
  input.name = inputObj.innerText;
  input.style.color = 'green';
  return [label, input];
};


// put everything in a span then a div
export const buildSpan = (spanObj) => {
  const spanList = spanObj.spanList;
  let div = document.createElement('div');
  // a flattened list of nodes
  const spanNodes = buildNodeList(spanList);
  let span = appendListToParent(spanNodes,'span');
  div.appendChild(span);
  return [div];
};

export const buildTwoColumn = (colObj) => {
  const headers = colObj.headers
  const nodes = colObj.nodes

  let colDiv = document.createElement('div');
  colDiv.className = 'row';

  if (headers.length != nodes.length) {
    return [colDiv]; // empty value
  }


  for (var i = 0; i < headers.length; i++) {
    let currHead = document.createElement('span');

    currHead.style.color = 'green'; // apply your style
    currHead.appendChild(document.createTextNode(headers[i]));

    let currCol = document.createElement('div');
    const currNodeList = nodes[i];

    currCol.appendChild(currHead); // add header
    buildUi(currCol, currNodeList); // add elements

    colStyle(currCol);

    colDiv.appendChild(currCol); // append to parent Div
  }

  rowStyle(colDiv);
  console.log(`colDiv`, colDiv);
  return [colDiv];

};

/**
* Functions to concatenate and manipulate components
*/


// appends elements to the node from list.
export const appendList = (node, eltList) => {
  console.log(`eltList`, eltList);
    try {
        for (const [index, elt] of eltList.entries()) {
          node.appendChild(elt);
        }
    }
    catch (e) {
        console.log('append to node error', e);
    }
};


// append everything in eltList to given node type
// returns a div with all elements in eltList appended
export const appendListToParent = (eltList, type = 'div', node) => {
  let newNode;
  switch (type) {
      case 'div':
        newNode = document.createElement('div');
        appendList(newNode, eltList);
        break;
      case 'span':
        let span = document.createElement('span');
        newNode = document.createElement('div');
        appendList(span, eltList);
        newNode.appendChild(span);
        break;
      case 'other': // for DOM containers
        if (node)
          newNode = node;
          appendList(newNode, eltList);
        break;
      default:
        newNode = document.createElement('div');
        break;
  }
  // console.log('type is ', node);
  // appendList(newNode, eltList);
  return newNode;
};

export const getNode = (obj) => {
  switch (obj.uiType) {
      case 'dropdown':
          return buildDropdown(obj);
      case 'stepper':
          return buildStepper(obj);
      case 'checkbox':
          return buildCheckboxes(obj);
      case 'button':
          return buildButton(obj);
      case 'radio':
          return buildRadios(obj);
      case 'table':
          return buildTable(obj);
      case 'column':
          return buildTwoColumn(obj);
      case 'input':
          return buildInput(obj);
      case 'break':
          return [document.createElement('br')];
      case 'span':
        return buildSpan(obj);
      default:
          return;
  }
};


export const getNodeWithParent = (obj) => {
  // get list of elts from getNode
  const nodeList = getNode(obj);
  // append all to specified type (div or span)
  console.log(`obj parentType`, obj.parentType)
  const newDiv = appendListToParent(nodeList, obj.parentType);
  return newDiv;
};

export const buildNodeList = (objList) => {
  let elements = [];
  for (const obj of objList) {
    elements.push(getNodeWithParent(obj));
  }
  return elements; //.flat() don't need to flatten b/c all items from getNodeWithParent are divs
};


// In plugin constructor, call: buildUi(container, inputs, this);
// where inputs is the list of type stepObj or dropObj and *this* is the plugin class
//
// export const buildUi = (parentType, objList) => {
//     const elements = buildNodeList(objList);
//     appendListToParent(elements, parentType);
// };

export const buildUi = (container, objList) => {
    const elements = buildNodeList(objList);
    appendListToParent(elements, 'other', container);
    console.log(`UI`, container);
};
