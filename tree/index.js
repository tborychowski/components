const style = `
.tree {
	-moz-user-select: none;
	user-select: none;
	cursor: default;
	width: inherit;
	position: relative;
	font: normal 1em sans-serif;
}

.edit-box,
.edit-off,
.tree.edit .edit-on { display: none; }

.tree.edit .edit-box,
.tree.edit .edit-off { display: block; }
`;

const template = `<div class="tree">
	<div class="edit-toggle">
		<button class="edit-on">Edit</button>
		<button class="edit-off">Done</button>
	</div>
	<div class="edit-box">
		<form class="edit-form">
			<input type="hidden" name="id">
			<select name="parentId"></select>
			<input name="name">
			<button class="btn-save">Save</button>
		</form>
		<button class="btn-new">New</button>
	</div>
	<div class="tree-content"></div>
</div>`;


class perfectCalendar extends HTMLElement {

	constructor () {
		super();
		this.template = document.createElement('template');
		this.template.innerHTML = `<style>${style}</style>${template}`;
		this.templateContent = this.template.content;
	}

	static get observedAttributes () { return ['edit']; }

	connectedCallback () {
		this.attachShadow({ mode: 'open' });
		this.shadowRoot.appendChild(this.templateContent.cloneNode(true));
		this.el = this.shadowRoot.querySelector('.tree');
		this.editboxEl = this.el.querySelector('.edit-box');
		this.treeEl = this.el.querySelector('.tree-content');
		this.formEl = this.el.querySelector('.edit-form');

		this.el.addEventListener('click', this.onClick.bind(this));
		this.formEl.addEventListener('submit', this.onSubmit.bind(this));
	}

	attributeChangedCallback(name, oldVal, newVal) {
		if (name === 'edit') {
			this.el.classList.toggle('edit', newVal !== null);
		}
	}

	set edit (val) {
		const isEdit = Boolean(val);
		if (isEdit) this.setAttribute('edit', '');
		else this.removeAttribute('edit');
	}

	get edit () { return this.hasAttribute('edit'); }


	get data () { return this._data; }

	set data (data) {
		if (Array.isArray(data)) this._data = data;
		else this._data = this.flatten(data);

		this.deflatten(this._data);

		this.render();
	}


	itemTemplate (item) {
		return `<a href="#" class="cat" data-id="${item.id}" data-name="${item.name}"
			data-parent-id="${item.parentId}">${item.name}</a>`;
	}


	createTree (data, html = []) {
		if (!data.length) data = [data];
		for (let item of data) {
			html.push('<li>' + this.itemTemplate(item));
			if (item.items) html.push(this.createTree(item.items));
			html.push('</li>');
		}
		return `<ul class="category-tree">${html.join('')}</ul>`;
	}


	render () {
		this.treeEl.innerHTML = this.createTree(this.deflatten(this._data));
		this.formEl.parentId.innerHTML = this._data
			.map(o => `<option value="${o.id}">${o.name}</option>`);
	}


	// tree object ==> flat array
	flatten  (data) {
		let res = [];
		if (!Array.isArray(data)) data = [data];
		data.forEach(d => {
			res.push({ id: d.id, name: d.name, parentId: d.parentId });
			if (d.items) res = res.concat(this.flatten(d.items));
		});
		return res;
	}

	// flat array ==> tree
	deflatten  (data, parentId) {
		let res = data
			.filter(i => i.parentId === parentId)
			.map(i => {
				const items = this.deflatten(data, i.id);
				if (items.length) i.items = items;
				return i;
			});
		return res.length === 1 && !parentId ? res[0] : res;
	}


	editCategory(el, data) {
		this.formEl.id.value = data.id;
		this.formEl.name.value = data.name;
		this.formEl.parentId.value = data.parentId;
	}


	resetForm () {
		this.formEl.reset();
		this.formEl.id.value = '';
	}

	onSubmit (e) {
		e.preventDefault();
		const data = {
			id: this.formEl.id.value,
			parentId: this.formEl.parentId.value,
			name: this.formEl.name.value,
		};

		let item;
		if (data.id) {
			item = this._data.find(i => i.id === data.id);
			Object.assign(item, data);
		}
		else {
			item = Object.assign({}, data);
			item.id = data.name;
			this._data.push(item);
		}

		this.resetForm();
		this.render();
		this.dispatchEvent(new CustomEvent('save', { detail: item }));
	}

	onClick (e) {
		const target = e.target;

		const cat = target.closest('.cat');
		if (cat) {
			const data = cat.dataset;
			e.preventDefault();
			const detail = Object.assign({}, data);
			if (this.edit) return this.editCategory(cat, detail);
			return this.dispatchEvent(new CustomEvent('change', { detail }));
		}

		const editOn = target.closest('.edit-on');
		if (editOn) return this.edit = true;

		const editOff = target.closest('.edit-off');
		if (editOff) return this.edit = false;

		const btnNew = target.closest('.btn-new');
		if (btnNew) return this.resetForm();
	}

}

customElements.define('perfect-tree', perfectCalendar);
