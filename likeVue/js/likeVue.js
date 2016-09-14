
(function(root){
	var prev = root.likeVue;

	function likeVue(obj){

		var params = obj;

		params.textNodes = [];

		function getParams(){
			params.keys = _.keys(obj.data);
		};

		function render(){
			var el = obj.el,
				data = obj.data;

			var ele = document.querySelectorAll(el);

			// 存储当前dom所有子文本节点
			function forever(father){
				_.each(father, function(son, i){
					if(son.nodeType == 3 && son.textContent.trim().length ){
						params.textNodes.push(son);
					}
					if(son.childNodes.length && son.nodeType != 3 ){
						forever(son.childNodes);
					}
				})
			}

			console.log(ele[0].innerHTML)

			// innerText替换

			// for(var i=0, len=ele.length; i<len; i++){
			// 	var tpl = ele[i].innerText;
			// 	var html = _.template(tpl)(data);
			// 	ele[i].innerHTML = html;
			// }

		};

		function bindEvent(){
			var _obj = _.extend(obj.data, Backbone.Events);

			function handleChange(params){

			}

			var ele = document.querySelectorAll(obj.el),
				model = ele.querySelectorAll("[v-model]");

			var models = _.groupBy(model, function(v, i){
				return v.getAttibute('v-model');
			})

			console.log("model")	
		};

		render();
	};

	var tools = {
		'start' : '<(\w)',

		'reg' : function(keyName){
			return /{{([\s\S]+?)}}/g
		}
	};

	// 放出接口
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