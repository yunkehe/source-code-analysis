var _obj1 = {
		"name": "heke", 
		"age": 26,
	};

var _obj2 = {
		"name": "yunkehe", 
		"age": 26,
	};

//  extends js object as Backbone object
var obj1 = _.extend(_obj1, Backbone.Events);
var obj2 = _.extend(_obj2, $Backbone.Events);

function handleChange(e){
	console.log("handleChange e", e);
};

function handleGo(e){
	console.log("handleGo e", e);
};

function handleStop(e){
	console.log("handleStop e", e);
};

obj1.on({"go": handleGo, "stop": handleStop, "change": handleChange});
obj2.on({"go": handleGo, "stop": handleStop, "change": handleChange});

