$(function(){

	//Handlebars	
	var source = $("#routes-template").html();
	var template = Handlebars.compile(source);
	
	//partial for the keys of each collection
	Handlebars.registerPartial('keys', $('#keys-partial').html());

	//helper function that iterates over the keys
	Handlebars.registerHelper('each_key', function(colls, options){
		var ret = '';
		for(var i = 0; i < colls.length; i++){
			for(var x in colls[i]){
				ret = ret + options.fn({key : x, prop : colls[i][x]});
			}
		}
		return ret;
	});

	//ajax get request for all the collection names
	//and dynamically produces them on the page
	$.get("/listNames", function(data){
		var context = {colls:data};
		$("#routes").html(template(context));
	});
});