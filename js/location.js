var currcoord = [0, 0];

var padding = {
	top: 70,
	bottom: 70,
	left: 70,
	right: 70
};


// Check if is mobile / touch. if touch - show mobile version
checkMobile = function () {
	var check = false;
	(function (a) {
		if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
	})(navigator.userAgent || navigator.vendor || window.opera);
	if (window.innerWidth < 800) {
		check = true;
	}
	return check;
};


var isMobile = checkMobile();

if (isMobile) {
	padding = {
		top: 40,
		bottom: 40,
		left: 40,
		right: 40
	};
}

mapboxgl.accessToken = 'pk.eyJ1IjoidGFtaXJwIiwiYSI6ImNqbnJmcWI5NTA3NzQzbHFwNjNhZG13ZzAifQ._fiDTor5dh9bZqlCOrfO2Q';

var map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/tamirp/cjnrgql5r1zfl2slrl9p0o03r',
	center: [34.8008359, 32.0900011],
	zoom: 17,
	bearing: 0,
	pitch: 50
});


try {
	if (navigator.geolocation) {

		navigator.geolocation.watchPosition(function (pos) {
			$.ajax('http://ip-api.com/json')
		.then(
			function success(response) {

				applyRoute(pos,response.city);			},

			function fail(data, status) {

				//TODO
			}
		);
		
			},
			function (error) {
				fallbackGPS();
			});
	} else {
		fallbackGPS();
	}
} catch (evt) {
	fallbackGPS();
}


function fallbackGPS() {
	console.log('fallback!');

	$.ajax('http://ip-api.com/json')
		.then(
			function success(response) {

				applyRoute({
					coords: {
						"latitude": response.lat,
						"longitude": response.lon
					}
				},response.city);			},

			function fail(data, status) {

				//TODO
			}
		);

}

function applyRoute(pos,city) {
	getRoute([pos.coords.longitude, pos.coords.latitude]);
	currcoord = [pos.coords.longitude, pos.coords.latitude];

	var geojson = {
		type: 'FeatureCollection',
		features: [{
				type: 'Feature',
				geometry: {
					type: 'Point',
					coordinates: [pos.coords.longitude, pos.coords.latitude]
				},
				properties: {
					title: 'Your Location<br><b>'+city+'</b>'
				}
			},
			{
				type: 'Feature',
				geometry: {
					type: 'Point',
					coordinates: [34.8008359, 32.0900011]
				},
				properties: {
					title: '13.2.2018<br><b>ISVIS 2019</b>'
				}
			}
		]
	};


	geojson.features.forEach(function (marker) {

		// create a HTML element for each feature
		var el = document.createElement('div');
		el.className = 'map-marker';
		el.innerHTML = marker.properties.title;

		// make a marker for each feature and add to the map
		new mapboxgl.Marker(el)
			.setLngLat(marker.geometry.coordinates)
			.addTo(map);
	});


	map.fitBounds([
		currcoord,
		[34.8008359, 32.0900011]
	], {
		padding: {
			top: 70,
			bottom: 70,
			left: 70,
			right: 70
		}
	});
	setTimeout(
		function () {
			finishMapinitialAnimation = true;
			scrollNow();
			introData.isPageLoaded = true;

		}, 1500);

}

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