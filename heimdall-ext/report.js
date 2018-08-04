'use strict';

// Render loading screen
document.querySelector('#content').innerHTML = '<p>Loading</p>';

// Enable direct communication to background thread
var bPort = browser.runtime.connect();
var bPortIndex = null;

const validStates = [
  'U',
  'F',
  'D',
  'C',
  'B',
  'A',
  'A+'
];

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Render report
function renderPage(m) {
  document.querySelector('#content').innerHTML = '<p>Rendering report.</p>';
  if(m.hasOwnProperty('response') && !m.hasOwnProperty('error')) {
    // Header
    var div = document.createElement('div');
    var tableContainer = document.createElement('div');
    tableContainer.className = 'table-responsive';
    var table = document.createElement('table');
    table.className = 'table table-sm table-striped';
    table.setAttribute('id', 'report-table');

    var thead = document.createElement('thead');
    var tbody = document.createElement('tbody');

    // Title
    if(m.response.hasOwnProperty('url') && m.response.url) {
      document.querySelector('#title').innerText = m.response.url;
    }

    // Result
    if(m.response.hasOwnProperty('state') && m.response.state && validStates.includes(m.response.state)) {
      var rating = document.querySelector('#rating');
      var overallRating = document.querySelector('#overallRating');

      if(validStates.includes(m.response.state)) {
        rating.innerText = m.response.state;
        if(m.response.state === 'A+') {
          overallRating.className = 'bgGradeAA';
        } else {
          overallRating.className = 'bgGrade' + m.response.state;
        }

      } else {
        rating.innerText = 'U';
        overallRating.className = 'bgGradeU';
      }
    }

    // Type
    if(m.response.hasOwnProperty('type') && m.response.type) {
      document.querySelector('#scanType').innerText = capitalizeFirstLetter(m.response.type);
    }

    // Module Result
    if(m.response.hasOwnProperty('moduleResults') && m.response.moduleResults && m.response.moduleResults.length) {
      var h4 = document.createElement('h4');
      h4.innerText = 'Full Report';
      div.appendChild(h4);

      // Build table
      var tr = document.createElement('tr');
      var th1 = document.createElement('th');
      var th2 = document.createElement('th');
      var th3 = document.createElement('th');
      tr.className = '';
      th1.innerText = 'Score';
      th1.className = 'col1 text-center';
      th2.innerText = 'Module';
      th2.className = 'col2';
      th3.innerText = 'Message';
      th3.className = 'col3';
      tr.appendChild(th1);
      tr.appendChild(th2);
      tr.appendChild(th3);
      thead.appendChild(tr);

      // Loop through each result
      m.response.moduleResults.forEach(function(value) {
        // Create row
        var tr = document.createElement('tr');
        tr.className = '';

        // Create columns
        var td1 = document.createElement('td');
        td1.className = 'col1 text-center';
        var td2 = document.createElement('td');
        td2.className = 'col2';
        var td3 = document.createElement('td');
        td3.className = 'col3 border-left';

        // Score column
        if(value.code === 6) {
          td1.className += ' bgGradeAAHalf';
        } else {
          td1.className += ' bgGrade' + validStates[value.code] + 'Half';
        }

        if(validStates.length >= value.code) {
          td1.innerHTML = '<img class="smallkey" src="./icons/' + validStates[value.code] + '_128.png" width="128" height="128" title="' + validStates[value.code] + '">';
          document.querySelector('#favicon').setAttribute('href', '/icons/' + validStates[value.code] + '_32.png');
        } else {
          td1.innerHTML = '<img class="smallkey" src="./icons/U_128.png" width="128" height="128" title="U">';
          document.querySelector('#favicon').setAttribute('href', '/icons/U_32.png');
        }

        // Module column
        if(value.link) {
          var a1 = document.createElement('a');
          var s1 = document.createElement('span');
          s1.setAttribute('style', 'font-size: 80%;vertical-align: super;');
          a1.setAttribute('href', value.link);
          a1.setAttribute('target', '_blank');
          a1.setAttribute('title', value.description);
          a1.innerText = value.name;
          a1.appendChild(s1);
          td2.appendChild(a1);
        } else {
          td2.innerText = value.name;
        }

        // Message column
        if(value.message) {
          td3.innerText = value.message;
        }

        // Build row and append to table body
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tbody.appendChild(tr);
      })

      // Build final table
      table.appendChild(thead);
      table.appendChild(tbody);
      tableContainer.appendChild(table);
      div.appendChild(tableContainer);

      // Render it
      document.querySelector('#content').innerHTML = '';
      document.querySelector('#header').setAttribute('style', 'display: block;');
      document.querySelector('#content').appendChild(div);
    }
  }
}


function handleMessageError(error) {
  document.querySelector('#content').innerHTML = '<p>Error sending message to background thread.</p>';
}

// Handler, sends request to background thread for full report
function handleFirstMessageResponse(m) {
  if(m.hasOwnProperty('response') && !m.hasOwnProperty('error') && m.response.hasOwnProperty('response')) {
    document.querySelector('#content').innerHTML = '<p>Running full scan, please wait.</p>';
    m.response.response.quick = false;
    m.response.response.bPortIndex = bPortIndex;
    bPort.postMessage({request: m.response.response});
  } else {
    document.querySelector('#content').innerHTML = '<p>Unable to get quick report.</p>';
  }
}

// Handler for receiving a message from background thread port
bPort.onMessage.addListener(function(m) {
  if(m.hasOwnProperty('index')) {
    // If we have an index, use it
    bPortIndex = m.index;
    var tabId = decodeURIComponent(new URL(window.location).searchParams.get('tabId'));

    var sendingFirst = browser.runtime.sendMessage({tabId: tabId});
    sendingFirst.then(handleFirstMessageResponse, handleMessageError);
  } else if(m.hasOwnProperty('response')) {
    // If we have a response, render it
    renderPage(m.response);
  }
});
