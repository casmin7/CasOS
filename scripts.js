
function timeUpdate() {

var zeclock = new Date().toLocaleString();
document.getElementById("clock").innerHTML = zeclock;
// var timeText = document.querySelector("#clock");
// timeText.innerHTML = currentTime
}

timeUpdate();
setInterval(timeUpdate, 1000);

