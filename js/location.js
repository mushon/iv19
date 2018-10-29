// geo-location shim

// currentely only serves lat/long
// depends on jQuery

// doublecheck the ClientLocation results because it may returning null results

;(function(geolocation){

    if (geolocation) return;
    
    var cache;
    
    geolocation = window.navigator.geolocation = {};
    geolocation.getCurrentPosition = function(callback){
      
      if (cache) callback(cache);
      
      $.getScript('//www.google.com/jsapi',function(){
        
       // sometimes ClientLocation comes back null
       if (google.loader.ClientLocation) {
        cache = {
          coords : {
            "latitude": google.loader.ClientLocation.latitude, 
            "longitude": google.loader.ClientLocation.longitude
          }
        };
       }
        
        callback(cache);
      });
      
    };
    
    geolocation.watchPosition = geolocation.getCurrentPosition;
  
  })(navigator.geolocation);
  
  
  
mapboxgl.accessToken = 'pk.eyJ1IjoidGFtaXJwIiwiYSI6ImNqbnJmcWI5NTA3NzQzbHFwNjNhZG13ZzAifQ._fiDTor5dh9bZqlCOrfO2Q';

var map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/tamirp/cjnrgql5r1zfl2slrl9p0o03r',
	center: [34.8008359, 32.0900011],
	zoom: 17,
	bearing: 0,
	pitch: 50
});


navigator.geolocation.watchPosition(function (pos) {
	getRoute([pos.coords.longitude, pos.coords.latitude])
	map.on("load", function(){
		scrollNow(); 
		map.fitBounds([
			[pos.coords.longitude, pos.coords.latitude],
			[34.8008359, 32.0900011]
		], {
			padding: {
				top: 40,
				bottom: 40,
				left: 40,
				right: 40
			}
		});
	 })
});


function getRoute(startPos) {
	var start = startPos;
	var end = [34.8008359, 32.0900011]; // Shenkar
	var directionsRequest = 'https://api.mapbox.com/directions/v5/mapbox/walking/' + start[0] + ',' + start[1] + ';' + end[0] + ',' + end[1] + '?geometries=geojson&access_token=' + mapboxgl.accessToken;
	$.ajax({
		method: 'GET',
		url: directionsRequest,
	}).done(function (data) {
		var route = data.routes[0].geometry;
		map.addLayer({
			id: 'shenkar-route',
			type: 'line',
			source: {
				type: 'geojson',
				data: {
					type: 'Feature',
					geometry: route
				}
			},
			paint: {
				'line-width': 4,
				'line-color': '#fff'
			}
		});
	});
}