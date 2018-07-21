// const statusP = document.querySelector('.status');
// const statusContainer = document.querySelector('.heading');
// statusContainer.style.maxHeight = '0px';


const statusBar = {
  p: document.querySelector('.status'),
  container: document.querySelector('.heading'),
  closeButton: document.querySelector('.close'),
  toggle: () => {

    if (statusBar.container.style.maxHeight === '0px') {
      statusBar.container.style.maxHeight = '40px';
    } else {
      statusBar.container.style.maxHeight = '0px';
    }
  },
  write: (str) => {
    statusBar.p.innerText = str;
  },
  popup: (str) => {
    statusBar.write(str);
    statusBar.container.style.maxHeight = '40px';
  }
};
statusBar.container.style.maxHeight = '0px';
statusBar.closeButton.addEventListener('click',statusBar.toggle)


// const toggleMaxHeight = (el) => {
//   if (el.style.maxHeight === '0px') {
//     el.style.maxHeight = '40px';
//   } else {
//     el.style.maxHeight = '0px';
//   }
// }


const mymap = L.map('mapid').setView([49.2609325, -123.112955], 13);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox.streets'
  // ,
  // accessToken: 'your.mapbox.access.token'
}).addTo(mymap);

let currentLocation;
let myMarker;
const cars = [];
const carMarkers = [];

const panToCurrentLocation = (zoom=14) => {
   // mymap.setZoom(zoom);
   mymap.flyTo(currentLocation,zoom);
   // mymap.setZoom(zoom);
   // mymap.setZoomAround(currentLocation,zoom);
}
const geoDist = (lat1, lon1, lat2, lon2) => {
  //returns distance, in meters, between two sets of co-ordinates
  const toRadians = (deg) => deg * Math.PI / 180;
  const latRad1 = toRadians(lat1),
    latRad2 = toRadians(lat2),
    lonDiffRad = toRadians(lon2-lon1),
    R = 6371e3;
  return Math.acos( Math.sin(latRad1)*Math.sin(latRad2) + Math.cos(latRad1)*Math.cos(latRad2) * Math.cos(lonDiffRad) ) * R;
}

const sortByDistance = (evoCarArray) =>
  evoCarArray.sort((a,b)=>{
    const [lat,lon] = [...currentLocation];
    let aDist = geoDist(lat,lon,a.Lat,a.Lon);
    let bDist = geoDist(lat,lon,b.Lat,b.Lon);
    if (aDist < bDist) { return -1; }
    if (aDist > bDist) { return 1; }
    return 0;
  })

const getCars = (url,arr) =>
  fetch(url)
  .then(resp => resp.json(), err=>console.log(err))
  .then(json => arr.push(...json.data))
  .catch(err => console.log(err));

const setCarMarkers = (evoCarArray) => {
  const max = 5;

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
      distance: ${Math.round(geoDist(currentLocation[0],currentLocation[1],cars[i].Lat,cars[i].Lon))}m`
    )
  }

}

const carsLoaded = async () => {
  await getCars('js/demo.json',cars);
  sortByDistance(cars);
  setCarMarkers(cars);
  panToCurrentLocation(14);
}

const setCurrentLocation = (lat,lon,cb) => {
  currentLocation = [lat,lon];
  if (cb) { cb(); }
  carsLoaded();
}

const setMyMarker = () => myMarker = L.marker(currentLocation).addTo(mymap);
 // mymap.setZoom(16) && mymap.setView(currentLocation)

const getLocation = () => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition((pos) => setCurrentLocation(pos.coords.latitude,pos.coords.longitude,setMyMarker),(err)=>console.log(err));
  } else {
    console.log('No geolocation service found');
  }
}






window.addEventListener('DOMContentLoaded',getLocation);
// window.addEventListener('loaded',panToCurrentLocation);
