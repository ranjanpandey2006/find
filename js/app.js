var map;
var infoWindow;
var item,latitude,longitude,marker,geocoder,location;
$(document).ready(function(){
	$('.btn-map').click(function(){
		item = $("#item").val();
		initialize();
	});
	$('.my-location').click(function(){
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(setCurrentPosition);
		} else { 
			alert("Geolocation is not supported by this browser.");
		}
	});
	
	// initialize();
	geocoder = new google.maps.Geocoder();
	$("#autocomplete").autocomplete({
                  source:function(request,response){
                      geocoder.geocode({'address':request.term},function(results){
                          response($.map(results,function(item){
                              return {
                                 label:item.formatted_address,
                                 value:item.formatted_address,
                                 latitude:item.geometry.location.lat(),
                                 longitude:item.geometry.location.lng(),
                              }
                              
                          }))
                      })
                 },
                  select:function(event,ui) {
                   // location    =   new google.maps.LatLng(ui.item.latitude,ui.item.longitude);
                   // map.setCenter(location);
                    latitude = ui.item.latitude;
					longitude = ui.item.longitude;
                    
                }
                  
              })
	
});
function initialize(){
	var center = new google.maps.LatLng(latitude,longitude);
	var mapOptions = {
		center : center,
		zoom : 13
	};
	map = new google.maps.Map(document.getElementById('map'),mapOptions);
	/*var request = {
		location : center,
		radius : 2047,
		types : [item]
	};*/
	var request = {
		location : center,
		radius : '2047',
		query : item
	};
	infoWindow = new google.maps.InfoWindow();
	var service = new google.maps.places.PlacesService(map);
	//service.nearbySearch(request,callback);
	service.textSearch(request,callback);
}
function callback(results,status){
	if(status == google.maps.places.PlacesServiceStatus.OK){
		for(var i = 0; i < results.length; i++){
	//	console.log(results[i]);
			createMarker(results[i]);
		}
	}
}
function createMarker(place){
	var placeLoc = place.geometry.location;
	marker = new google.maps.Marker({map : map, position : placeLoc});
	
	google.maps.event.addListener(marker,'mouseover', function(){
	//console.log("place - ",place);
	var timings = [];
	 $.getJSON("https://maps.googleapis.com/maps/api/place/details/json?placeid="+place.place_id+"&key=AIzaSyDxzQqGoVzPsoUJ6k-SD_GtdSwHpgnSwPk",function(data){
            timings = data.weekday_text;
        });
	//alert(timings);
	//	infoWindow.setContent('<img src='+place.icon+'>'+'<h5>'+place.name+'</h5>');
		infoWindow.setContent('<div style="width:200px;"><h5 style="color:#DB6946">'+place.name+'</h5>'+'<h6 style="color:#399956">'+place.formatted_address+'</h6>'+'<h5 style="color:#327AC2">Rating : '+place.rating+'</h5>'+'</div>');
		infoWindow.open(map,this);
	});
}
function setCurrentPosition(position) {
	var initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
    latitude = position.coords.latitude; 
    longitude = position.coords.longitude;
}