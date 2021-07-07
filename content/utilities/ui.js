/**
     EXAMPLE:

     See generalize move plugin for use case of UI

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

export const buildStepper = (stepObj) => {
    const name = stepObj.name;
    const getValueLabel = stepObj.getValueLabel;
    let stepperLabel = document.createElement('label');
    stepperLabel.innerText = stepObj.innerText;
    stepperLabel.style.display = 'block';
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
            // update of class Object
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
    radioLabel.style.display = 'block';
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

// Returns an array: [levelLabel, level]
// Need to pass class instance in order to update variables.
// Append to the DOM in given order.
export const buildDropdown = (dropObj) => {
    const getValueLabel = dropObj.getValueLabel;
    const name = dropObj['name'];
    let levelLabel = document.createElement('label');
    levelLabel.innerText = dropObj.innerText;
    levelLabel.style.display = 'block';
    let level = document.createElement('select');
    level.style.background = 'rgb(8,8,8)';
    level.style.width = '100%';
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

// builds an HTML button
export const buildButton = (buttonObj) => {
  let button = document.createElement('button');
  //button.style.width = '100%';
  button.style.marginBottom = '10px';
  button.innerHTML = buttonObj['innerHTML'];
  button.onclick = buttonObj['onClick'];
  return [button];
};

// items is a list of objects with the following structure:
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

export const buildTwoColumn = (colObj) => {
  let colDiv = document.createElement('div');
  colDiv.className = 'row';
  let col1 = document.createElement('div');
  let col2 = document.createElement('div');

  let head1 = document.createElement('span');
  head1.style.color = 'green'; // apply your style
  head1.appendChild(document.createTextNode(colObj.head1));

  let head2 = document.createElement('span');
  head2.style.color = 'green'; // apply your style
  head2.appendChild(document.createTextNode(colObj.head2));

  col1.appendChild(head1);
  col2.appendChild(head2);
  col1.appendChild(colObj.node1);
  col2.appendChild(colObj.node2);
  colStyle(col1);
  colStyle(col2);

  colDiv.appendChild(col1);
  colDiv.appendChild(col2);
  rowStyle(colDiv);
  console.log(`colDiv`, colDiv);
  return [colDiv];
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

// appends elements to the DOM from list.
export const appendListToDom = (container, eltList) => {
  console.log(`eltList`, eltList);
    try {
        for (const [index, elt] of eltList.entries()) {
          // console.log(`dom elt\n`, elt);
          container.appendChild(elt);
        }
    }
    catch (e) {
        console.log('append to DOM error', e);
    }
};


export const appendChildTo = (node, child) => {
  return node.appendChild(child);
};

// append to div or span instead of general container
export const appendListToNode = (eltList, type) => {
  let node;
  switch (type) {
      case 'div':
          node = document.createElement('div');
          break;
      case 'span':
          node = document.createElement('span');
          break;
      default:
        node = document.createElement('div');
        break;
  }
  console.log('type is ', node);
  appendListToDom(node, eltList);
  return node;
};

export const buildNodeList = (objList) => {
  let elements = [];
  for (const obj of objList) {
    elements.push(getNode(obj));
  }
  return elements.flat();
};

// put everything in a span then a div
export const buildSpan = (spanObj) => {
  const spanList = spanObj.spanList;
  let div = document.createElement('div');
  // a flattened list of nodes
  const spanNodes = buildNodeList(spanObj.spanList);
  let span = appendListToNode(spanNodes,'span');
  div.appendChild(span);
  return [div];
};

export const getNode = (obj) => {
  switch (obj.uiType) {
      case 'dropdown':
          return buildDropdown(obj);
          break;
      case 'stepper':
          return buildStepper(obj);
          break;
      case 'checkbox':
          return buildCheckboxes(obj);
          break;
      case 'button':
          return buildButton(obj);
          break;
      case 'radio':
          return buildRadios(obj);
          break;
      case 'table':
          return buildTable(obj);
          break;
      case 'column':
          return buildTwoColumn(obj);
          break;
      case 'input':
          return buildInput(obj);
          break;
      case 'break':
          return document.createElement('br');
          break;
      case 'span':
        return buildSpan(obj);
        break;
      default:
          return;
  }
};

// wrapper that appends the node to a div
export const buildNode = (obj, type) => {
  let result = getNode(obj);
  return appendListToNode(result, type);
};


// In plugin constructor, call: buildUi(container, inputs, this);
// where inputs is the list of type stepObj or dropObj and *this* is the plugin class
export const buildUi = (container, objList) => {
    const elements = buildNodeList(objList);
    appendListToDom(container, elements);
};
