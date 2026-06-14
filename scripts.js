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
var clockElement = document.getElementById("clock");
var gnomePanel = document.getElementById("gnome-panel");

clockElement.addEventListener("click", function(e) {
    gnomePanel.classList.toggle("hidden");
    e.stopPropagation(); // Stops the window listener below from immediately hiding it
});

// Click outside to close the panel
window.addEventListener("click", function(e) {
    if (!gnomePanel.contains(e.target) && e.target !== clockElement) {
        gnomePanel.classList.add("hidden");
    }
});


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

// var welcomeScreen = document.getElementById("welcomescreen");
// var welcomeScreenClose = document.querySelector("#welcomeclose");
// var welcomeScreenOpen = document.querySelector("#welcomeopen");

// welcomeScreenClose.addEventListener("click", function() {
//    closeWindow(welcomeScreen);
// });

// welcomeScreenOpen.addEventListener("click", function() {
//    openWindow(welcomeScreen);
// });

// dragElement(welcomeScreen);

function windowSetup(name) {
  var windowScreen = document.getElementById(name + "screen");
  var windowScreenClose = document.querySelector("#" + name + "close");
  var windowScreenOpen = document.querySelector("#" + name + "open");

  windowScreenClose.addEventListener("click", function() {
    closeWindow(windowScreen);
  });

  windowScreenOpen.addEventListener("click", function() {
    openWindow(windowScreen);
  });

  windowScreen.addEventListener("mousedown", function() {
    updateZindex(windowScreen);
  });

  dragElement(windowScreen);
}

windowSetup("welcome");
windowSetup("calc");