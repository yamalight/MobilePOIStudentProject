$(function(){
	var latitude, longitude;
    if(geo_position_js.init()){
            geo_position_js.getCurrentPosition(onGeoCoordinates, onGeoError, 
            	{enableHighAccuracy:true,options:5000});
    }

    function onGeoCoordinates(p){
        latitude = p.coords.latitude;
        longitude = p.coords.longitude;
        console.log(latitude, longitude);
    }

    function onGeoError(p){
        latitude = longitude = -1;
        console.log('error finding location');
    }

	$("#loadData").live('vclick', function(){
		if( latitude == -1 && longitude == -1 ){
			alert("Cannot detect location");
			return;
		}
	
		var query = "\
			PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#> \
			PREFIX place: <http://linkedgeodata.org/ontology/> \
			SELECT DISTINCT ?place WHERE { \
			?place geo:geometry ?geo .\
			?place a place:Restaurant . \
			Filter(bif:st_intersects (?geo, bif:st_point ("+longitude+", "+latitude+"), 10)) \
			} LIMIT 10 \
		";
		
		
	});
})