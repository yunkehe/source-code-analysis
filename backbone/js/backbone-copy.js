
(function(root){

	var Backbone = {};


	Backbone.Events = {

		on: function(name, callback, context){
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


	var eventsApi = function(obj, action, name, rest){
		if(!name) return true;
	};


	root.$Backbone = Backbone;

}(window))