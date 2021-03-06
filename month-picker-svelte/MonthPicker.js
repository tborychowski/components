/* MonthPicker.html generated by Svelte v1.59.0 */

function data() {
	const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	const selected = (new Date()).getMonth() + 1;
	return { months, selected };
};

var methods = {
	onclick (selected) {
		this.set({ selected });
		this.fire('change', { selected });
	}
};

function add_css() {
	var style = createElement("style");
	style.id = 'svelte-3go4ab-style';
	style.textContent = ".svelte-3go4ab.month-picker,.svelte-3go4ab .month-picker{-moz-user-select:none;user-select:none;position:relative;font:normal 1em sans-serif;width:inherit;display:flex}.svelte-3go4ab.month,.svelte-3go4ab .month{flex:1}.svelte-3go4ab.selected,.svelte-3go4ab .selected{color:blue;font-weight:bold}";
	appendNode(style, document.head);
}

function create_main_fragment(component, state) {
	var div;

	var each_value = state.months;

	var each_blocks = [];

	for (var i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(component, assign(assign({}, state), {
			each_value: each_value,
			month: each_value[i],
			i: i
		}));
	}

	return {
		c: function create() {
			div = createElement("div");

			for (var i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}
			this.h();
		},

		h: function hydrate() {
			div.className = "month-picker svelte-3go4ab";
		},

		m: function mount(target, anchor) {
			insertNode(div, target, anchor);

			for (var i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}
		},

		p: function update(changed, state) {
			var each_value = state.months;

			if (changed.selected || changed.months) {
				for (var i = 0; i < each_value.length; i += 1) {
					var each_context = assign(assign({}, state), {
						each_value: each_value,
						month: each_value[i],
						i: i
					});

					if (each_blocks[i]) {
						each_blocks[i].p(changed, each_context);
					} else {
						each_blocks[i] = create_each_block(component, each_context);
						each_blocks[i].c();
						each_blocks[i].m(div, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].u();
					each_blocks[i].d();
				}
				each_blocks.length = each_value.length;
			}
		},

		u: function unmount() {
			detachNode(div);

			for (var i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].u();
			}
		},

		d: function destroy() {
			destroyEach(each_blocks);
		}
	};
}

// (2:1) {{#each months as month, i}}
function create_each_block(component, state) {
	var month = state.month, each_value = state.each_value, i = state.i;
	var button, text_value = month.substr(0, 3), text, button_class_value;

	return {
		c: function create() {
			button = createElement("button");
			text = createText(text_value);
			this.h();
		},

		h: function hydrate() {
			button.className = button_class_value = "month " + (i + 1 === state.selected ? 'selected' : '');
			addListener(button, "click", click_handler);

			button._svelte = {
				component: component,
				each_value: state.each_value,
				i: state.i
			};
		},

		m: function mount(target, anchor) {
			insertNode(button, target, anchor);
			appendNode(text, button);
		},

		p: function update(changed, state) {
			month = state.month;
			each_value = state.each_value;
			i = state.i;
			if ((changed.months) && text_value !== (text_value = month.substr(0, 3))) {
				text.data = text_value;
			}

			if ((changed.selected) && button_class_value !== (button_class_value = "month " + (i + 1 === state.selected ? 'selected' : ''))) {
				button.className = button_class_value;
			}

			button._svelte.each_value = state.each_value;
			button._svelte.i = state.i;
		},

		u: function unmount() {
			detachNode(button);
		},

		d: function destroy() {
			removeListener(button, "click", click_handler);
		}
	};
}

function click_handler(event) {
	var component = this._svelte.component;
	var each_value = this._svelte.each_value, i = this._svelte.i, month = each_value[i];
	component.onclick(i + 1);
}

function MonthPicker(options) {
	init(this, options);
	this._state = assign(data(), options.data);

	if (!document.getElementById("svelte-3go4ab-style")) add_css();

	this._fragment = create_main_fragment(this, this._state);

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);
	}
}

assign(assign(MonthPicker.prototype, methods), {
 	destroy: destroy,
 	get: get,
 	fire: fire,
 	observe: observe,
 	on: on,
 	set: set,
 	teardown: destroy,
 	_set: _set,
 	_mount: _mount,
 	_unmount: _unmount,
 	_differs: _differs
 });

MonthPicker.prototype._recompute = noop;

function createElement(name) {
	return document.createElement(name);
}

function appendNode(node, target) {
	target.appendChild(node);
}

function assign(tar, src) {
	for (var k in src) tar[k] = src[k];
	return tar;
}

function insertNode(node, target, anchor) {
	target.insertBefore(node, anchor);
}

function detachNode(node) {
	node.parentNode.removeChild(node);
}

function destroyEach(iterations) {
	for (var i = 0; i < iterations.length; i += 1) {
		if (iterations[i]) iterations[i].d();
	}
}

function createText(data) {
	return document.createTextNode(data);
}

function addListener(node, event, handler) {
	node.addEventListener(event, handler, false);
}

function removeListener(node, event, handler) {
	node.removeEventListener(event, handler, false);
}

function init(component, options) {
	component._observers = { pre: blankObject(), post: blankObject() };
	component._handlers = blankObject();
	component._bind = options._bind;

	component.options = options;
	component.root = options.root || component;
	component.store = component.root.store || options.store;
}

function destroy(detach) {
	this.destroy = noop;
	this.fire('destroy');
	this.set = this.get = noop;

	if (detach !== false) this._fragment.u();
	this._fragment.d();
	this._fragment = this._state = null;
}

function get(key) {
	return key ? this._state[key] : this._state;
}

function fire(eventName, data) {
	var handlers =
		eventName in this._handlers && this._handlers[eventName].slice();
	if (!handlers) return;

	for (var i = 0; i < handlers.length; i += 1) {
		handlers[i].call(this, data);
	}
}

function observe(key, callback, options) {
	var group = options && options.defer
		? this._observers.post
		: this._observers.pre;

	(group[key] || (group[key] = [])).push(callback);

	if (!options || options.init !== false) {
		callback.__calling = true;
		callback.call(this, this._state[key]);
		callback.__calling = false;
	}

	return {
		cancel: function() {
			var index = group[key].indexOf(callback);
			if (~index) group[key].splice(index, 1);
		}
	};
}

function on(eventName, handler) {
	if (eventName === 'teardown') return this.on('destroy', handler);

	var handlers = this._handlers[eventName] || (this._handlers[eventName] = []);
	handlers.push(handler);

	return {
		cancel: function() {
			var index = handlers.indexOf(handler);
			if (~index) handlers.splice(index, 1);
		}
	};
}

function set(newState) {
	this._set(assign({}, newState));
	if (this.root._lock) return;
	this.root._lock = true;
	callAll(this.root._beforecreate);
	callAll(this.root._oncreate);
	callAll(this.root._aftercreate);
	this.root._lock = false;
}

function _set(newState) {
	var oldState = this._state,
		changed = {},
		dirty = false;

	for (var key in newState) {
		if (this._differs(newState[key], oldState[key])) changed[key] = dirty = true;
	}
	if (!dirty) return;

	this._state = assign(assign({}, oldState), newState);
	this._recompute(changed, this._state);
	if (this._bind) this._bind(changed, this._state);

	if (this._fragment) {
		dispatchObservers(this, this._observers.pre, changed, this._state, oldState);
		this._fragment.p(changed, this._state);
		dispatchObservers(this, this._observers.post, changed, this._state, oldState);
	}
}

function _mount(target, anchor) {
	this._fragment[this._fragment.i ? 'i' : 'm'](target, anchor || null);
}

function _unmount() {
	if (this._fragment) this._fragment.u();
}

function _differs(a, b) {
	return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}

function noop() {}

function blankObject() {
	return Object.create(null);
}

function callAll(fns) {
	while (fns && fns.length) fns.shift()();
}

function dispatchObservers(component, group, changed, newState, oldState) {
	for (var key in group) {
		if (!changed[key]) continue;

		var newValue = newState[key];
		var oldValue = oldState[key];

		var callbacks = group[key];
		if (!callbacks) continue;

		for (var i = 0; i < callbacks.length; i += 1) {
			var callback = callbacks[i];
			if (callback.__calling) continue;

			callback.__calling = true;
			callback.call(component, newValue, oldValue);
			callback.__calling = false;
		}
	}
}
export default MonthPicker;