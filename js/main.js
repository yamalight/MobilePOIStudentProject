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
		console.log('radious: ' + radious);
		var results = $("#formResults").val();
		console.log('results: ' + results);
		var catType = $("#formSelectType").val();
		console.log('type: ' + catType);
	
		var query = "\
			PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> \
			PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#> \
			PREFIX place: <http://linkedgeodata.org/ontology/> \
			SELECT DISTINCT ?place ?placeName WHERE { \
			?place geo:geometry ?geo .\
			?place a place:" + catType + " . \
			?place rdfs:label ?placeName . \
			Filter(bif:st_intersects (?geo, bif:st_point ("+longitude+", "+latitude+"), " + radious + ")) \
			} LIMIT " + results + " \
		";
		
		var url = "http://linkedgeodata.org/sparql?format=json&query="+encodeURIComponent(query);
		
		$.get(url, function(data){
			var results = data.results.bindings;
			places = [];
						
			for(var i = 0; i < results.length; i++){
				places.push({
					url: results[i].place.value,
					name: results[i].placeName.value
				});
			}
			
			$.mobile.changePage("pages/results.html");
		});
		
		$("#resultsPage").live('pagebeforeshow', function(){
			$("#placeTemplate").tmpl(places).appendTo("#resList");
			$("#resList").listview('refresh');
		});
	});
})
