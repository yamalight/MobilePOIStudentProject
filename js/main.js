$(function(){
	var latitude = 43.465187, longitude = -80.522372;
	var places = [];
	
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
		
		var radious = $("#formRadius").val();
		var results = $("#formResults").val();
		var catType = $("#formSelectType").val();
	
		var query = "\
			PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> \
			PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#> \
			PREFIX place: <http://linkedgeodata.org/ontology/> \
			PREFIX placeProp:<http://linkedgeodata.org/property/> \
			SELECT DISTINCT ?place ?placeName  (bif:st_distance(?geo,bif:st_point ("+longitude+", "+latitude+"))) as ?distance ?url WHERE { \
			?place geo:geometry ?geo .\
			?place a place:" + catType + " . \
			?place rdfs:label ?placeName . \
			Filter(bif:st_intersects (?geo, bif:st_point ("+longitude+", "+latitude+"), " + radious + ")) .\
			OPTIONAL{ ?place placeProp:url ?url} \
			} LIMIT " + results + " \
		";
		
		var url = "http://linkedgeodata.org/sparql?format=json&query="+encodeURIComponent(query);
		
		$.get(url, function(data){
			var results = data.results.bindings;
			places = [];
						
			for(var i = 0; i < results.length; i++){
				places.push({
					uri: results[i].place.value,
					name: results[i].placeName.value,
					distance: results[i].distance.value,
					url: results[i].url.value
				});
			}
			console.log('places: ' + places);
			
			$.mobile.changePage("pages/results.html");
		});
		
		$("#resultsPage").live('pagebeforeshow', function(){
			$("#placeTemplate").tmpl(places).appendTo("#resList");
			$("#resList").listview('refresh');
		});
	});
})
