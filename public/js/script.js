const socket = io();
if(navigator.geolocation){
    navigator.geolocation.watchPosition((position) => {
        const {latitude, longitude} = position.coords;
        socket.emit('sendLocation', {latitude, longitude});
    },(error) => {
        console.log(error);
    }, {enableHighAccuracy: true,
        maximumAge:0,
        timeout:5000
    });
}
const map = L.map('map').setView([0,0], 10);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution:"OpenStreetMap" 
}).addTo(map);

const marker={};

socket.on('receiveLocation', (data) => {
    const {latitude, longitude, id} = data;
    map.setView([latitude, longitude]);
    if(marker[id]){
        marker[id].setLatLng([latitude, longitude]);}
    else{
        marker[id]=L.marker([latitude, longitude]).addTo(map);
    }
});
socket.on('removeLocation', (id) => {

   if(marker[id]){
       map.removeLayer(marker[id]);
       delete marker[id];
   }
    
});