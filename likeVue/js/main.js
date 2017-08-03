
define(function(require, exports, module){

	// function main(){

	// 	this.init = function(){
	// 		require.async("../deom.tpl.html", function(demo){
	// 			var html = _.template(demo, {"data": {"message": "hello world"}});
	// 			$("#demo-contant").html(html);
	// 		})
	// 	};

	// };

	// var main = {
	// 	init : function(){
	// 		// require.async("tpl/demo.tpl.html", function(demo){
	// 		// 	var data = {"message": "hello world"};
	// 		// 	var html = _.template(demo)(data);
	// 		// 	$("#demo-contant").html(html);
	// 		// })

	// 		// new Vue({
	// 		//   el: '#app',
	// 		//   data: {
	// 		//     message: 'Hello Vue.js!'
	// 		//   }
	// 		// })
	// 		// new Vue({
	// 		//   el: '#app',
	// 		//   data: {
	// 		//     message: 'Hello Vue.js!'
	// 		//   }
	// 		// })
	// 	}
	// };

	var main = {
		init : function(){

			// new likeVue({
			//   el: '#app',
			//   data: {
			//     message: 'Hello Vue.js!'
			//   }
			// })

			new likeVue({
				el: '#app2',
				data: {
					message: 'Hello likeVue.js!',
					age: "16岁"
				}
			});

		}
	}

	module.exports = main;
})