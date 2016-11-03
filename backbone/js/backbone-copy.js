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
	// 传入了一个空对象
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

		once: function(name, callback, context){
			if (!eventsApi(this, 'once', name, [callback, context]) || !callback) return this;
			var self = this;
			var once = _.once(function() {
			  self.off(name, once);
			  callback.apply(this, arguments);
			});
			once._callback = callback;
			return this.on(name, once, context);
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
				for(var j=0, l=events.length; j<l; j++){
					var event = events[j];
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

		},

		listenTo: function(obj, name, callback){
			// 监听对象上保存被监听对象, 通过被监听对象_listenId标识
			var listeningTo = this._listeningTo || (this._listeningTo = {});
			// obj上生成唯一 _listenId, 供监听对象使用
			var id = obj._listenId || (obj._listenId = _.unique('l'));
			listeningTo[id] = obj;
			if(!callback && typeof name === 'object') callback = this;
			obj.on(name, callback, this);
			// 返回监听对象
			return this;
		},

		listenToOnce: function(obj, name, callback){
			// 遍历对象 {'change': handleChange, 'go': handleGo}
			// 拆分后再次执行 下次执行跳过此步骤 perfect!
			if(typeof name === 'object'){
				for(var event in name) this.listenToOnce(obj, event, name[event]);
				return this;
			}

			if(eventSplitter.test(name)){
				var names = name.split(eventSplitter);
				for(var i=0, len = names.length; i<len; i++){
					this.listenToOnce(obj, names[i], callback);
				}
				return this;
			}

			if(!callback)return this;

			// 尚无清除这段代码的意思
			var once = _.once(function(){
				this.stopListening(obj, name, once);
				callback.apply(this, arguments);
			});
			// 这是 什么意思
			once._callback = callback;
			return this.listeningTo(obj, name, once);
		},

		stopListening: function(obj, name, callback){
			var listenTo = this._listeningTo;
			if(!listenTo) return this;
			var remove = !name && !callback;
			if(!callback && typeof name === 'object') callback = this;
			if(obj)(listeningTo = {})[obj._listenId] = obj;
			for(var id in listeningTo){
				obj = listeningTo[id];
				obj.off(name, callback, this);
				if(remove || _.isEmpty(obj._events))delete this._listeningTo[id];
			}
			return this;
		},
		
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

	// 向后兼容
	Events.bind = Events.on;
	Events.unbind = Events.off;

	// 给Backbone对象本身也具有Events的各种属性和方法 
	_.extend(Backbone, Events);


	var Model = Backbone.Model = function(attributes, options){
		var attrs = attributes || {};
		options || (options = {});
		this.cid = _.uniqueId('c');
		this.attributes = {};

		if(options.collection)this.collection = options.collection;
		if(options.parse) attrs = this.parse(attrs, options) || {};
		// _.defaults只覆盖值为undefined的属性
		attrs = _.defaults({}, attrs, _.result(this, 'defaults'));

		this.set(attrs, options);
		this.changed = {};
		this.initialize.apply(this, arguments);
	};

	// 联系上所有继承的方法
	_.extend(Model.prototype, Events, {
		changed: null,
		validationError: null,

		// 哪一个属性作为认证id 默认是id
		idAttribute: 'id',

		// 一个空方法 构造时可以重写
		initialize: function(){},

		// 返回属性的副本
		toJSON: function(){
			return _.clone(this.attributes);
		},

		// Backbone.sync方法的代理方法 
		sync: function(){
			return Backbone.sync.apply(this, arguments);
		},

		// 返回一个属性的值
		get: function(attr){
			return this.attributes[attr];
		},

		// 替换html字符为html实体
		escape: function(attr){
			return _.escape(this.get(attr));
		},

		has: function(attr){
			return this.get(attr) != null;
		},

		// 代理 _.matches()
		matches: function(attrs){
			return _.matches(attrs)(this.attributes);
		},

		// 利用hash表设置model属性
		set: function(key, val, options){
			// attrs 所有属性值
			var attr, attrs, unset, changes, silent, changing, prev, current;
			if(key == null) return this;

			// key = {title: "March 20", content: "In his eyes she eclipses..."} 
			if( typeof key === 'object'){
				attrs = key;
				options = val;
			}else{
				// "title", "A Scandal in Bohemia"
				// key = 'title', val = 'A Scandal in Bohemia';
				(attrs = {})[key] = val;
			}
			// attrs 保存传入的对象
			
			options || (options = {});

			// 验证 用户自己定义validate方法
			if(this._validate(attrs, options))return false;

			// 提前属性和参数
			unset			= options.unset;
			silent			= options.silent;
			changes			= [];
			changing		= this._changing;
			this._changing	= true;

			// 没有改变之前的属性值
			if(!changing){
				this._previousAttributes = _.clone(this.attributes);
				this.changed = {};
			}

			// current prev
			current = this.attributes, prev = this._previousAttributes;

			// 检查id的变化
			if(this.idAttribute in attrs) this.id = attrs[this.idAttribute];

			// 遍历attrs
			for( attr in attrs){
				val = attrs[attr];
				if(!_.isEqual(current[attr], val)) changes.push(attr);
				if(!_.isEqual(prev[attr], val)){
					this.changed.push(attr);	
				} else {
					delete this.changed[attr];
				}
				// this.unset使用 删除指定属性
				unset ? delete current[attr] : current[attr] = val;
			}

			// 触发事件
			if(!silent){
				if(changes.length)this._pending = options;
				for(var i=0, length=changes.length; i<length; i++){
					this.trigger('change:'+changes[i], this, current[changes[i]], options);
				}
			}

			// 在change事件嵌套中 change会被递归调用
			// 理解trigger的内部机制
			if(changing) return this;
			if(!silent){
				while(this._pending){
					options = this._pending;
					this._pending = false;
					this.trigger('change', this, options);
				}
			}
			this._pending = false;
			this._changing = false;

			return this;

		},

		// 删除指定属性  
		unset: function(attr, options){
			return this.set(attr, void 0, _.extend({}, options, {'unset': true}));
		},

		// 删除所有属性
		// 可以传入 silent参数 重置时不触发change事件
		clear: function(options){
			var attrs = {};
			for(var key in this.attributes) attrs[key] = void 0;
			return this.set(attrs, _.extend({}, options, {'unset': true}));
		},

		// 不传参数 判断上次change事件之后 是否hasChanged
		// 实际可以判断上次set新参数后, 是否hasChanged, 即使设置参数时不触发change事件 
		hasChanged: function(attr){
			if(attr == null) return !_.isEmpty(this.changed);
			return _.has(this.changed, attr);
		},

		// 1. 没有参数时 返回上次set之后 改变的属性hash
		// 2. 可选参数为 
		// {'address':'chongqing', 'name': 'he', 'age': 23}
		// 返回一个object 只包含不同值的属性
		changedAttributes: function(diff){
			if(!diff) return this.hasChanged() ? _.clone(this.changed) : false;
			var val, changed = false;
			var old = this._changing ? this.previousAttributes : this.attributes;
			for(var attr in diff){
				if(_.isEqual(old[attr],( val = diff[attr] ) ))continue;
				(changed || (changed = {}))[attr] = val;
			}
			return changed;
		},

		// 在事件触发过程中获取previousAttribute的值
		previous: function(attr){
			if(attr == null || !this._previousAttributes) return null;
			return this._previousAttributes[attr];
		},

		previousAttributes: function(){
			return _.clone(this._previousAttributes);
		},

		// 常用方法来了
		// fetch 想服务器发送请求 更新model状态
		fetch: function(options){
			var options = options ? _.clone(options) : {};
			// 标记是否解析
			if(options.parse === void 0) options.parse = true;
			var model = this;
			var success = options.success;
			options.success = function(resp){
				// model.parse
				if( !model.set(model.parse(resp, options), options)) return false;
				if(success)success(model, resp, options);
				model.trigger('sync', model, resp, options);
			};
			wrapError(this, options);
			return this.sync('read', this, options);
		},
		
		// 仅简单返回后台实际返回的response
		// 可以自己重载进行修改
		parse: function(resp, options){
			return resp;
		},

		// 代理Backbone.sync方法
		sync: function(){
			return Backbone.sync.apply(this, arguments);
		},
		// 内部使用 判断验证
		_validate: function(attrs, options){
			// 没有设置验证时 总是通过验证
			if(!options.validate || !this.validate) return true;
			// 复制一份包含 原来attributes属性和传入attrs的对象
			attrs = _.extend({}, this.attributes, attrs); 
			// 验证抛出的错误
			var error = this.validationError = this.validate(attrs, options) || null;
			// 没有抛出错误 验证通过
			if(!error) return true;
			// 报错 触发invalid事件 
			this.trigger('invalid', this.error, _.extend(options, {validationError: error}));
			return false;
		}

	});
/*
 *
 * 
 */

	Backbone.sync = function(method, model, options){

	};

	// 继承方法
	var extend = function(protoProps, staticProps){
		// Backbone.Model.extend() 调用时 this指向Model/View/Collection/..
		var parent = this;
		var child;

		if( protoProps && _.has(protoProps, 'constructor') ){
			// 自己定义constructor
			child = protoProps.constructor;
		}else{
			// 
			child = function(){ return parent.apply(this, arguments); }
		}

		// 给构造器添加静态属性
		_.extend(child, parent, staticProps);

		// 
		var Surrogate = function(){ this.constructor = child; };
		Surrogate.prototype = parent.prototype;
		// new Surrogate 等价于 new Surrogate(); 构造函数调用时js中允许省略()
		// 生成一个新{__proto__: parent.prototype} 原型链继承
		child.prototype = new Surrogate;
		
		
		if(protoProps) _.extend(child.prototype, protoProps);
		child.__super__ = parent.prototype;

		return child;
	};


	// 设置继承
	Model.extend = extend;
	 
	var wrapError = function(model, options){
		var error = options.error;
		options.error = function(resp){
			if(error) error(model, resp, options);
			model.trigger('error', model, resp, options);
		};
	};

	// 返回backbone.对象
	return Backbone;

}))
