(function(root, factory){

	if(typeof define === 'function' && define.amd){
		define(['underscore', 'jquery', 'exports'], function(_, $, exports){
			root.$Backbone = factory(root, exports, _, $);
		})

	}else if(typeof exports !== 'undefined'){
		var _ = require('underscore');
		factory(root, exports, _);
	}else{
		root.$Backbone = factory(root, {}, root._, (root.jQuery || root.Zepto || root.ender || root.$)); 
	}

}(this, function(root, Backbone, _, $){

	var perviousBackbone = root.Backbone;

	var array = [];
	var slice = array.slice;

	Backbone.VERSION = "0.0.1";

	Backbone.$ = $;

	Backbone.noConflict = function(){
		root.Backbone = previousBackbone;
		return this;
	}

	Backbone.emulateHTTP = false;

	Backbone.emulateJSON = false;



	var Events = Backbone.Events = {

		on: function(name, callback, context) {
		  if (!eventsApi(this, 'on', name, [callback, context]) || !callback) return this;
		  this._events || (this._events = {});
		  var events = this._events[name] || (this._events[name] = []);
		  events.push({callback: callback, context: context, ctx: context || this});
		  return this;
		},

		off: function(name, callback, context){
			if(!this._events || !eventsApi(this, "off", name, [callback, context]) )return this;

			// 删除所有绑定的事件
			if(!name && !callback && !context){
				this._events = void 0;
				return this;
			};

			var names = name ? [name] : _.keys(this._events);
			
			for(var i=0,length=names.length; i<length; i++){
				name = names[i];

				var events = this._events[name]
				// continue 继续执行
				if(!events)continue;

				if(!callback && !context){
					delete this._events[name];
					continue;
				}

				// 找到剩余的事件
				var remaining = [];
				for(var j=0, l=events.length; k<l; k++){
					var event = events[k];
					if(
						callback && callback !== event.callback &&
						callback !== event.callback._callback ||
						context && context !== event.context
					){
						remaining.push(event);
					}
				}

				if(remaining.length){
					this._events[name] = remaining;
				}else{
					delete this._events[name];
				}

			}

			return this;

		},

		trigger: function(name){
			if(!this._events)return this;
			// array.slice
			var args = slice.call(arguments, 1);

			if(!eventsApi(this, 'trigger', name, args))return this;
			var events = this._events[name];
			var eventsAll = this._events.all;
			if(events) triggerEvents(events, args);
			if(eventsAll) triggerEvents(eventsAll, args);
			return this;

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

	// 很难相信但是很合适的一个内部方法
	var triggerEvents = function(events, args){
		// var ev, i=-1, l=events.length, a1=args[0], a2=args[1], a3=args[2];

		// switch(args.length){
		// 	case 0: while(++i<l){(ev = events[i]).callback.call(ev.ctx)};return;
		// 	case 1: while(++i<l){ (ev = events[i]).callback.call(ev.ctx, a1)}; return;
		// 	case 2: while(++i<l){ (ev = events[i]).callback.call(ev.ctx, a1, a2)}; return;
		// 	case 3: while(++i<l){ (ev = events[i]).callback.call(ev.ctx, a1, a2, a3)}; return;
		// 	default: while(++i<l){ (ev = events[i]).callback.apply(ev.ctx, args)}; return;
		// }

		var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
		switch (args.length) {
		  case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx); return;
		  case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1); return;
		  case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2); return;
		  case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3); return;
		  default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args); return;
		}
	}

	// 返回backbone.对象
	return Backbone;

}))
