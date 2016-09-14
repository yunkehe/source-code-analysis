
// 配置路径
seajs.config({
	paths : {
		'js': './js',
		"tpl": '../../likeVue/tpl'
	}
})

//  ./ 引入页面的位置
seajs.use('./js/main.js', function(main){
	// console.log("main.js", main)
	main.init();
})