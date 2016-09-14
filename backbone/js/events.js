var obj = {"name": "heke", "age": 26};

var _obj = _.extend(obj, Backbone.Events);

function handleChange(e){
	console.log("e", e);

};

_obj.on("change", handleChange);


// obj.name = "he";
// obj.trigger("change");