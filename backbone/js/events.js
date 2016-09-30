var _obj1 = {
		"name": "heke", 
		"age": 26,
		"listen": function(){
			alert("listen"+this.name);
		}
	};

var _obj2 = {
		"name": "yunkehe", 
		"age": 26,
		"render": function(){
			alert("render "+this.name);
		}
	};

var view = _.extend(_obj2, Backbone.Events);

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

obj1.on({"go": handleGo, "stop": handleStop});
obj2.on({"go": handleGo, "stop": handleStop});

view.listenTo(obj1, 'go', view.render);

