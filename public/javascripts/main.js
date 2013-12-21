$(function(){

	//Handlebars
	var source = $("#routes-template").html();
	var template = Handlebars.compile(source);
	Handlebars.registerPartial('keys', $('#keys-partial').html());

	//ajax get request for all the collection names
	//and dynamically produces them on the page
	$.get("/listNames", function(data){
		//console.log(data);
		var nameArr = [];
		for(var i = 0; i < data.length; i++){
			var obj = {};
			var name = data[i]["name"].split('.');
			if(name[1] !== 'system'){
				obj["name"] = name[1];
				nameArr.push(obj);
			}
		}
		$("#routes").html(template({colls : nameArr}));
	});


	//ajax get request for the keys
	$.get('/listKeys', function(data){
		console.log(data);
		//issue here is that listKeys needs to be done with listNames to create one array with each object as the collection name
		//and an array of key values associated with the collection name, so collection name should be key, with array of key values
		//as the keys for each collection.
	});

});