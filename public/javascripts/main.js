$(function(){

	var source = $("#routes-template").html();
	var template = Handlebars.compile(source);

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

	$.get('/listKeys', function(data){
		console.log(data);
	});

});