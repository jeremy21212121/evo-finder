
const mymap = L.map('mapid',{messagebox: true}).setView([49.2609325, -123.112955], 13);
mymap.messagebox.options.timeout = 10000;

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox.streets'
  // ,
  // accessToken: 'your.mapbox.access.token'
}).addTo(mymap);

let currentLocation;
let myMarker;
let cars = [];
let carMarkers = [];


const geoDist = (lat1, lon1, lat2, lon2) => {
  //returns distance, in meters, between two sets of co-ordinates
  const toRadians = (deg) => deg * Math.PI / 180;
  const latRad1 = toRadians(lat1),
    latRad2 = toRadians(lat2),
    lonDiffRad = toRadians(lon2-lon1),
    R = 6371e3;
  return Math.acos( Math.sin(latRad1)*Math.sin(latRad2) + Math.cos(latRad1)*Math.cos(latRad2) * Math.cos(lonDiffRad) ) * R;
};


const setCarMarkers = () => {
  new Promise((resolve,reject) => {
    if (cars.length === 0) { reject('Error loading cars.') }
    const max = 10;
    carMarkers = []; //init markers array in case its not the first time
    for (let i=0; i<max; i++) {
      carMarkers.push(
        L.marker( [cars[i].Lat, cars[i].Lon], {
          icon: L.icon({
            iconUrl:'img/blackMarker.png',
            iconSize:[25,25]
          })
        }).addTo(mymap)
      );
      carMarkers[i].bindPopup(
        `<b>${cars[i].Name}</b><br>
        fuel: ${cars[i].Fuel}%<br>
        distance: ${Math.round(geoDist(currentLocation[0],currentLocation[1],cars[i].Lat,cars[i].Lon))}m
        <a class="book-button" href="https://fo.evo.vulog.com/bcaa-front/Account/FindCars?id=${cars[i].Id}">Book This Car</a>
        `
      );
    }
    resolve();
  })
}

const sortByDistance = (evoCarArray) =>
  new Promise((resolve, reject)=>{
    try {
      evoCarArray.sort((a,b)=>{
        const [lat,lon] = [...currentLocation];
        let aDist = geoDist(lat,lon,a.Lat,a.Lon);
        let bDist = geoDist(lat,lon,b.Lat,b.Lon);
        if (aDist < bDist) { return -1; }
        if (aDist > bDist) { return 1; }
        return 0;
      });
    }
    catch(err) {
      reject( Error(`Interal Error: ${err.message}`) )
    }
    resolve();
  });

const getCars = (url) =>
  new Promise((resolve,reject) => {
    cars = [];//init cars array in case this is not the first time calling api
    fetch(url)
      .then(resp => {
        if (!resp.ok) {
          reject( Error(`Error getting car data: ${resp.status}`) );
        }
        return resp.json();
      })
      .then(json => cars.push(...json.data))
      .then(()=>resolve())
      .catch(err => reject(err))

  });

const setMyMarker = () =>
  new Promise( (resolve) => {
    L.marker(currentLocation).addTo(mymap);
    resolve();
  });

const setCurrentLocation = (lat,lon) =>
  new Promise( (resolve) => {
    currentLocation = [lat,lon];
    resolve();
});

const handleError = (err) => mymap.messagebox.show(`${err.message}`);


mymap.addEventListener('locationfound',(loc)=>{
  setCurrentLocation(loc.latitude,loc.longitude)
    .then(() => setMyMarker() )
    .then(() => getCars('http://localhost:8675/cars') )
    .then(() => sortByDistance(cars) )
    .then(() => setCarMarkers() )
    .then(() => mymap.flyTo(currentLocation,14) )
    .catch( err => handleError(err))
});
mymap.addEventListener('locationerror', (err) => handleError(err) );
mymap.locate({
  watch: false,
  setView: false,
  maxZoom: Infinity,
  timeout: 10000,
  maximumAge: 0,
  enableHighAccuracy: false
});
