export class Component extends HTMLElement {

	// constructor () { super(); }


	connectedCallback () {
		this._data = this.data();
		this.innerHTML = this.template();
		this.init();
		this.update(this._data);
	}

	disconnectedCallback () { this.destroy(); }


	template () { return ''; }
	data () { return {}; }

	set (data) {
		const newData = Object.assign({}, this._data, data);
		// fast & good enough
		if (JSON.stringify(this._data) !== JSON.stringify(newData)) {
			this._data = newData;
			this.update(this._data);
		}
	}

	get (prop) {
		if (typeof prop === 'undefined') return this._data;
		if (typeof this._data[prop] !== 'undefined') return this._data[prop];
		throw new Error(`Property ${prop} not found in data object.`);
	}


	init () {}
	destroy () {}
	update (/*data*/) {}

	fire (name, detail) {
		if (!detail) detail = this._data;
		this.dispatchEvent(new CustomEvent(name, { detail }));
	}
}

