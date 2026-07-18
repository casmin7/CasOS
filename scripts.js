function timeUpdate() {
    var now = new Date();
    
    // Clean GNOME-style 24h formatting
    var gnomeFormat = now.toLocaleDateString([], {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
    
    var cleanFormat = gnomeFormat.replace(',', '');
    document.getElementById("clock").innerHTML = cleanFormat;
}

timeUpdate();
setInterval(timeUpdate, 1000);

// Toggle the Calendar Panel

function notificationUpdate(message, origin) {
  const notificationArea = document.getElementById("notification-area");
  var notificationHtml = "<div class='" + origin + "-open notificationpill'>" + message + "</div>";

  if(notificationArea.innerHTML == "Clear as a bell!"){
      notificationArea.innerHTML = notificationHtml;
  }
  else {
      notificationArea.innerHTML += notificationHtml;
  }

}

notificationUpdate("New message received!", "calc");

function togglePanels(element) {
var clockElement = document.getElementById(element);
var clockPanel = document.getElementById(element + "-panel");

clockElement.addEventListener("click", function(e) {
    clockPanel.classList.toggle("hidden");
    e.stopPropagation(); // Stops the window listener below from immediately hiding it
});

// Click outside to close the panel
window.addEventListener("click", function(e) {
    if (!clockPanel.contains(e.target) && e.target !== clockElement) {
        clockPanel.classList.add("hidden");
    }
});
}

togglePanels("clock");
togglePanels("appselect");

var highestZIndex = 5;

function updateZindex(element) {
  if (element.style.zIndex < highestZIndex) {
    highestZIndex++;
    element.style.zIndex = highestZIndex;
  }
}

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

function closeWindow(element) {
    element.style.display = "none";
}

function openWindow(element) {
  element.style.display = "flex";
  updateZindex(element);
}

function windowSetup(name) {
  var windowScreen = document.getElementById(name + "screen");
  var windowScreenClose = document.querySelector("#" + name + "close");
  var windowScreenOpenButtons = document.querySelectorAll("." + name + "-open");

  windowScreenClose.addEventListener("click", function() {
    closeWindow(windowScreen);
  });

  windowScreenOpenButtons.forEach(function(button) {
    button.addEventListener("click", function() {
      openWindow(windowScreen);
    });
  });

  windowScreen.addEventListener("mousedown", function() {
    updateZindex(windowScreen);
  });

  dragElement(windowScreen);
}

windowSetup("welcome");
windowSetup("calc");



let currentInput = '0';
let historyExpression = '';
let isEvaluated = false;

const inputDisplay = document.getElementById('calc-input');
const historyDisplay = document.getElementById('calc-history');

function updateDisplay() {
    inputDisplay.innerText = currentInput;
    historyDisplay.innerText = historyExpression;
}

function appendNumber(num) {
    if (isEvaluated) {
        currentInput = num === '.' ? '0.' : num;
        isEvaluated = false;
    } else {
        if (num === '.' && currentInput.includes('.')) return; // No duplicate decimals
        if (currentInput === '0' && num !== '.') {
            currentInput = num;
        } else {
            currentInput += num;
        }
    }
    updateDisplay();
}

function appendOperator(op) {
    if (isEvaluated) {
        historyExpression = currentInput + ' ' + op + ' ';
        isEvaluated = false;
        currentInput = '0';
    } else {
        // If there's an active entry input, push it to history expression
        if (currentInput !== '0' || historyExpression === '') {
            historyExpression += currentInput + ' ' + op + ' ';
            currentInput = '0';
        } else if (historyExpression.length > 0) {
            // Replaces the last chosen operator if you change your mind mid-process
            historyExpression = historyExpression.trim().slice(0, -1) + op + ' ';
        }
    }
    updateDisplay();
}

function calculateResult() {
    if (historyExpression === '') return;
    
    // Construct the complete functional expression string
    let fullExpression = historyExpression + currentInput;
    
    try {
        // Use standard JS internal math evaluation safely via strict numeric parameters
        let result = Function('"use strict";return (' + fullExpression + ')')();
        
        // Formats long floating-point precision numbers neatly
        if (result.toString().includes('.') && result.toString().split('.')[1].length > 4) {
            result = parseFloat(result.toFixed(4));
        }
        
        historyExpression = fullExpression + ' =';
        currentInput = result.toString();
        isEvaluated = true;
    } catch (error) {
        currentInput = 'Error';
        historyExpression = '';
    }
    updateDisplay();
}

function clearCalc() {
    currentInput = '0';
    historyExpression = '';
    isEvaluated = false;
    updateDisplay();
}

function deleteLast() {
    if (isEvaluated) {
        clearCalc();
        return;
    }
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}