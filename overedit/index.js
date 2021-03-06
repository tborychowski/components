function Overedit (target, config = {}) {
	if (!(this instanceof Overedit)) return new Overedit(target, config);
	if (typeof target === 'string') target = document.querySelector(target);
	if (!target) throw new Error('Target does not exist!');

	this.target = target;
	this.input = null;
	this.config = config;
	this.value = this.config.value || this.target.innerText;
	this.state = {
		rendered: false
	};
	this.eventListeners = {
		cancel: [],
		save: [],
		done: []
	};
	return this.render();
}


Overedit.prototype.matchSize = function () {
	const targetSize = this.target.getBoundingClientRect();
	this.input.className = this.config.cls || 'overedit-input';
	this.input.style.position = 'absolute';
	this.input.style.width = targetSize.width + 'px';
	this.input.style.height = targetSize.height + 'px';
	this.input.style.top = targetSize.top + 'px';
	this.input.style.left = targetSize.left + 'px';
};


Overedit.prototype.initEvents = function () {
	this.input.addEventListener('keydown', this.onKeyDown.bind(this));
	this.input.addEventListener('blur', this.onBlur.bind(this));
};


Overedit.prototype.render = function () {
	this.input = document.createElement('input');
	this.input.value = this.value;
	this.matchSize();
	this.initEvents();
	document.body.appendChild(this.input);
	this.state.rendered = true;
	this.input.select();
};


Overedit.prototype.destroy = function () {
	this.input.remove();
	this.state.rendered = false;
	this.triggerEvent('done');
	return this;
};


Overedit.prototype.cancel = function () {
	if (!this.state.rendered) return this;
	this.triggerEvent('cancel');
	return this.onBlur();
};


Overedit.prototype.save = function () {
	if (!this.state.rendered) return this;
	if (this.value !== this.input.value) {
		this.triggerEvent('save', this.input.value);
	}
	return this.onBlur();
};


Overedit.prototype.onBlur = function () {
	if (!this.state.rendered) return this;
	this.state.rendered = false;		// chrome triggers blur and keydown in the same time
	return this.destroy();				// and they conflict when removing node from dom
};

Overedit.prototype.onKeyDown = function (e) {
	e.stopPropagation();
	if (e.key === 'Escape') {
		e.preventDefault();
		return this.cancel();
	}
	else if (e.key === 'Enter') {
		e.preventDefault();
		return this.save();
	}
};


Overedit.prototype.triggerEvent = function (eventName, ...params) {
	if (!this.eventListeners[eventName]) return this;
	this.eventListeners[eventName].forEach(cb => { cb.apply(cb, params); });
	return this;
};


Overedit.prototype.on = function (eventName, cb) {
	if (!this.eventListeners[eventName]) throw new Error(`Event doesnt exist: ${eventName}`);
	this.eventListeners[eventName].push(cb);
	return this;
};



if (typeof module === 'object') module.exports = Overedit;
