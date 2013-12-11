$(function(){

	var source = $("#routes-template").html();
	var template = Handlebars.compile(source);

	$.get("/list", function(data){
		var nameArr = [];
		for(var i = 0; i < data.length; i++){
			var obj = {};
			var name = data[i]["name"].split('.');
			obj["name"] = name[1];
			nameArr.push(obj);
		}
		var html = template(data);
		$("#routes").html(template({colls : nameArr}));
	});

});