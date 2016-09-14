var obj = {"name": "heke", "age": 26};

var _obj = _.extend(obj, Backbone.Events);

function handleChange(e){
	console.log("e", e);

};

_obj.on("change", handleChange);


(function(root){
	var prev = root.likeVue;

	var likeVue = function(){
		
	}

	if (typeof exports !== 'undefined') {
	  if (typeof module !== 'undefined' && module.exports) {
	    exports = module.exports = likeVue;
	  }
	  exports.likeVue = likeVue;
	} else {
	  root.likeVue = likeVue;
	}

}(this))


// obj.name = "he";
// obj.trigger("change");