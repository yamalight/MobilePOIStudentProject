$(function(){
	$("#loadData").live('vclick', function(){
		
	
		var query = "\
			PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#> \
			PREFIX place: <http://linkedgeodata.org/ontology/> \
			SELECT DISTINCT ?place WHERE { \
			?place geo:geometry ?geo .\
			?place a place:Restaurant . \
			Filter(bif:st_intersects (?geo, bif:st_point ("+lng+", "+lat+"), 10)) \
			} LIMIT 10 \
		";
	});
})