'use strict';

// Render a loading screen
document.querySelector('#content').innerHTML = '<p>Loading</p>';

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

// Render the popup
function handleMessageResponse(m) {
  document.querySelector('#content').innerHTML = '<p>Loading</p>';
  console.log(m);
  if(m.hasOwnProperty('response') && !m.hasOwnProperty('error')) {
    if(m.response.hasOwnProperty('response')) {
      // Header
      var div = document.createElement('div');
      var headerContainer = document.createElement('div');
      var header = document.createElement('div');
      var row = document.createElement('row');
      var headerLeft = document.createElement('div');
      var headerRight = document.createElement('div');
      row.className = 'row';
      row.className = 'row';
      headerContainer.className = 'col-lg-8 offset-lg-2 col-md-8 offset-md-2 col-sm-8 offset-sm-2';
      headerLeft.className = 'col-sm-6';
      headerRight.className = 'col-sm-6';
      header.setAttribute('id', 'headerSmall');

      var overallRatingP = document.createElement('h3');
      overallRatingP.innerText = 'Overall Rating';
      header.appendChild(overallRatingP);

      // Result
      if(m.response.response.hasOwnProperty('state') && m.response.response.state && validStates.includes(m.response.response.state)) {
        var overallRatingSmall = document.createElement('div');
        overallRatingSmall.setAttribute('id', 'overallRatingSmall');

        if(validStates.includes(m.response.response.state)) {
          overallRatingSmall.innerText = m.response.response.state;
          if(m.response.response.state === 'A+') {
            overallRatingSmall.className = 'bgGradeAA';
          } else {
            overallRatingSmall.className = 'bgGrade' + m.response.response.state;
          }

        } else {
          overallRatingSmall.innerText = 'U';
          overallRatingSmall.className = 'bgGradeU';
        }


        headerLeft.appendChild(overallRatingSmall);
      }

      // Type
      if(m.response.response.hasOwnProperty('type') && m.response.response.type) {
        var p = document.createElement('p');
        p.className = 'text-center text-sm-left';
        p.innerText = 'Scan Type: ' + capitalizeFirstLetter(m.response.response.type);
        headerRight.appendChild(p);
      }

      var p = document.createElement('p');
      p.className = 'text-center text-sm-left';
      p.innerText = 'Scan Mode: Quick';
      headerRight.appendChild(p);


      row.appendChild(headerLeft);
      row.appendChild(headerRight);
      header.appendChild(row);
      headerContainer.appendChild(header);
      div.appendChild(headerContainer);

      // Module Result
      if(m.response.response.state !== 'A+' && m.response.response.hasOwnProperty('moduleResults') && m.response.response.moduleResults && m.response.response.moduleResults.length) {
        var tableContainer = document.createElement('div');
        tableContainer.className = 'table-responsive';
        var table = document.createElement('table');
        table.className = 'table table-sm table-striped';
        table.setAttribute('id', 'report-table');

        var thead = document.createElement('thead');
        var tr = document.createElement('tr');
        var th1 = document.createElement('th');
        var th2 = document.createElement('th');
        tr.className = 'col1';
        th1.innerText = 'Score';
        th1.className = 'col2 text-center';
        th2.innerText = 'Module';
        th2.className = 'col3';
        tr.appendChild(th1);
        tr.appendChild(th2);
        thead.appendChild(tr);
        var tbody = document.createElement('tbody');
        m.response.response.moduleResults.forEach(function(value) {
          if(value.message) {
            console.log('Adding: ' + value.message);
            var tr = document.createElement('tr');
            tr.className = '';
            var td1 = document.createElement('td');
            td1.className = 'col1 text-center';
            var td2 = document.createElement('td');
            td2.className = 'col2';

            if(value.code) {
              if(value.code === 6) {
                td1.className += ' bgGradeAAHalf';
              } else {
                td1.className += ' bgGrade' + validStates[value.code] + 'Half';
              }
              td1.innerHTML = '<img class="smallkey" src="./icons/' + validStates[value.code] + '_128.png" width="128" height="128" title="' + validStates[value.code] + '">';
            } else {
              td1.className += ' bgGradeUHalf';
              td1.innerHTML = '<img class="smallkey" src="./icons/U_128.png" width="128" height="128" title="U">';
            }



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

            tr.appendChild(td1);
            tr.appendChild(td2);
            tbody.appendChild(tr);
          } else {
            console.log('Skipped: ' + value.name);
          }
        })

        table.appendChild(thead);
        table.appendChild(tbody);
        tableContainer.appendChild(table);
        div.appendChild(tableContainer);
      }

      // Full Report URL
      if(m.response.hasOwnProperty('tabId')) {
        var reportURL = document.querySelector('#reportURL');
        reportURL.target = '_blank';
        reportURL.href = '/report.html?tabId=' + encodeURIComponent(m.response.tabId);
        reportURL.setAttribute('style', 'display: block;');
      }

      document.querySelector('#content').innerHTML = '';
      document.querySelector('#content').appendChild(div);
    } else {
      document.querySelector('#content').innerHTML = '<p>Error reading response from tray applet.</p>';
    }
  }
}

function handleMessageError(error) {
  console.log(error);
}

// Handler for current tab, gets heimdall response data from background thread for relevant tab
function currentTab(tabs) {
  if(tabs && tabs.length) {
    var sending = browser.runtime.sendMessage({tabId: tabs[0].id});
    sending.then(handleMessageResponse, handleMessageError);
  }
}

function onTabError(error) {
  console.log(error);
}

// Get the currently active tab
var querying = browser.tabs.query({active: true, currentWindow: true});
querying.then(currentTab, onTabError);
