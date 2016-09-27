var obj = {
		"name": "heke", 
		"age": 26,
		"on": function(){
			alert("my own function on!");
		}
	};

//  extends js object as Backbone object
// var _obj = _.extend(obj, Backbone.Events);
var _obj = _.extend(obj, $Backbone.Events);

function handleChange(e){
	console.log("handleChange e", e);
};

function handleGo(e){
	console.log("handleGo e", e);
};

function handleStop(e){
	console.log("handleStop e", e);
};

_obj.on({"go": handleGo, "stop": handleStop, "change": handleChange});

