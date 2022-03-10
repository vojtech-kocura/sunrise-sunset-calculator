const _ = el => document.getElementById(el);

_("setDate").defaultValue = new Date().toISOString().substring(0,10); // setting date picker to today by default

const displayTime = _("displayTime");
let date;
let lat;
let long;
let offset;
let errorHandeler;

const getDate = () => date = _("setDate").value;

const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(separateLatLong);
  } else { 
    displayTime.innerHTML = "Geolokace není tímto prohlížečem podporována.";
  }
}

const separateLatLong = position => {
  lat = position.coords.latitude;
  long = position.coords.longitude;
  if(lat !== undefined || long !== undefined) {calculateTime(lat,long,date,offset)} // calling calculateTime() after allowing access to the location
}

const getOffset = () => {
  offset = new Date().getTimezoneOffset(), o = Math.abs(offset);
  offset = (offset < 0 ? "+" : "-") + ("00" + Math.floor(o / 60)).slice(-2) + ":" + ("00" + (o % 60)).slice(-2);
}


const calculateTime = (lat,long,date,offset) => {
  handleError();
  if(errorHandeler === "error") {console.clear(); location.reload();}
  const url = `https://api.met.no/weatherapi/sunrise/2.0/.json?lat=${lat}&lon=${long}&date=${date}&offset=${offset}`;
  fetch(url)
  .then(res => res.json())
  .then(data => {
    const sunriseTime = new Date(data.location.time[0].sunrise.time); 
    const sunsetTime = new Date(data.location.time[0].sunset.time);

    let today = new Date()
    let todayHours = today.getHours();
    let todayMinutes = today.getMinutes();
    today = today.toISOString().substring(0,10);

    let keywordSunrise;
    let keywordSunset;

    if(today > date) {keywordSunrise = "byl"; keywordSunset = "byl"} // picked date in the past
    else if(today < date) {keywordSunrise = "bude"; keywordSunset = "bude"} // picked date in the future
    else { //picked today's date
      if(todayHours < sunriseTime.getHours()) {keywordSunrise = "bude",keywordSunset = "bude"}
      else if(todayHours > sunriseTime.getHours() && todayHours < sunsetTime.getHours()) {keywordSunrise = "byl"; keywordSunset = "bude"}
      else {keywordSunrise = "byl"; keywordSunset = "byl"}
    }

    displaySunrise.innerHTML = `Východ slunce ${keywordSunrise} v ${sunriseTime.getHours()} hodin a ${sunriseTime.getMinutes()} minut.`;
    displaySunset.innerHTML = `Západ slunce ${keywordSunset} v ${sunsetTime.getHours()} hodin a ${sunsetTime.getMinutes()} minut.`;
  })
}

const handleError = () =>{
  if(lat === undefined || long === undefined || date === "" || offset === undefined) {
  alert("Vyplňte kroky ve správném pořadí a povolte údaje o poloze.");
  errorHandeler = "error";
    }
}

const listOfCities = () => { //TODO
  displayTime.innerHTML = 'TODO';
}


