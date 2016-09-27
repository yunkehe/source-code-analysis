
(function(root){

	var Backbone = {};


	Backbone.Events = {

		on: function(name, callback, context){
			if(!eventsApi(this, 'on', name, [callback, context]) || !callback) return this;
			this._events || (this._events = {});
			var events = this._events[name] || (this._events[name] = []);
			events.push({callback: callback, context: context, ctx: context || this});
		},

		trigger: function(name){

			var events = this._events[name];

			_.each(events, function(v, i){
				v.callback.apply(v.ctx);
			});
			
		}
	};

	var eventsSpliter = /\s+/;

	var eventsApi = function(obj, action, name, rest){
		// 没有name 不执行
		if(!name) return true;

		// handle events maps
		if(typeof name === 'object'){
			for(var key in name){
				obj[action].apply(obj, [key, name[key]].concat(rest) );
			}
			return false;
		}

		if(eventsSpliter.test(name)){
			var names = name.split(eventsSpliter);
			for(var i=0,length=names.length; i<length; i++){
				obj[action].apply(obj, [names[i]].concat(rest));
			}
			return false;
		}

		// name 不是object 也没有空格分隔 返回真 
		// 回到action中 可执行下一步
		return true;
	};


	root.$Backbone = Backbone;

}(window))