const style = `
.tree {
	-moz-user-select: none;
	user-select: none;
	cursor: default;
	width: inherit;
	position: relative;
	font: normal 1em sans-serif;
}

.tree-node { list-style: none; margin: 0; padding: 0; }
.tree-node ul { margin: 0; position: relative; margin-left: 1em; }

.tree-node ul ul { margin-left: 0.5em; }

.tree-node li {
	position: relative;
	margin: 0;
	color: #000;
	line-height: 2.1em;
	padding: 0 1.2em;
}

.tree-node ul::before,
.tree-node ul li::before {
	content: '';
	position: absolute;
	display: block;
}

.tree-node ul::before {
	top: 0;
	bottom: 18px;
	left: 0;
	width: 0;
	border-left: 1px solid #000;
}

.tree-node ul li::before {
	top: 1em;
	left: 0;
	height: 0;
	border-top: 1px solid #000;
	margin-top: -1px;
	width: 0.75em;
}




.edit-box,
.btn-new,
.edit-off,
.tree.edit .edit-on { display: none; }

.tree.edit .btn-new,
.tree.edit .edit-box,
.tree.edit .edit-off { display: block; }
`;

const template = `<div class="tree">
	<div class="edit-toggle">
		<button class="edit-on">Edit</button>
		<button class="edit-off">Done</button>
		<button class="btn-new">New</button>
	</div>
	<div class="edit-box">
		<form class="edit-form">
			<input type="hidden" name="id">
			<select name="parentId"></select>
			<input name="name">
			<button class="btn-save">Save</button>
			<button type="button" class="btn-del">Del</button>
		</form>
	</div>
	<div class="tree-content"></div>
</div>`;

const MAX_LEVEL = 2;

class perfectTree extends HTMLElement {

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

	attributeChangedCallback (name, oldVal, newVal) {
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
		if (this.isTree(data)) this._data = this.treeToArray(data);
		else this._data = data;
		this.render();
	}


	sort () {
		this._data.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
	}

	isTree (data) {
		if (!Array.isArray(data) || !data.length) return true;
		for (let i in data) if (data[i].items) return true;
		return false;
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
		return `<ul class="tree-node">${html.join('')}</ul>`;
	}


	render () {
		this.sort();
		this.treeEl.innerHTML = this.createTree(this.arrayToTree(this._data));

		let html = '<option></option>';
		html += this._data
			.filter(o => o.level < MAX_LEVEL - 1)	// if max_level === 2 -> this should be < 1
			.map(o => `<option value="${o.id}">${o.name}</option>`).join('');
		this.formEl.parentId.innerHTML = html;
	}


	// tree object ==> flat array
	treeToArray (data) {
		const res = [];
		if (!Array.isArray(data)) data = [data];
		data.forEach(item => {
			const itemCopy = Object.assign({}, item);
			delete itemCopy.items;
			res.push(itemCopy);
			if (item.items) res.push(...this.treeToArray(item.items));
		});
		return res;
	}

	// flat array ==> tree
	arrayToTree (data, parentId = '', level = 0) {
		let res = data
			.filter(i => (i.parentId || '') === parentId)
			.map(item => {
				const items = this.arrayToTree(data, item.id, level + 1);
				const newItem = Object.assign({}, item);
				if (items.length) newItem.items = items;
				newItem.level = level;
				this.modifyCategory(item.id, { level });
				return newItem;
			});
		return res;
	}


	resetForm () {
		this.formEl.reset();
		this.formEl.id.value = '';
	}

	addCategory (data) {
		const item = Object.assign({}, data);
		if (!data.id) item.id = data.name;
		this._data.push(item);
		return item;
	}

	modifyCategory (id, newData) {
		const item = this._data.find(i => i.id === id);
		if (item) Object.assign(item, newData);
		return item;
	}

	editCategory (el, data) {
		this.formEl.id.value = data.id;
		this.formEl.name.value = data.name;
		this.formEl.parentId.value = data.parentId;
	}

	deleteCategory (id) {
		if (!id) return;
		const item = this._data.find(i => i.id === id);
		const data = this._data.filter(i => i.id !== id && i.parentId !== id);
		this.resetForm();
		this.data = data;
		this.fireEvent('edit', { action: 'delete', item });
	}


	onSubmit (e) {
		e.preventDefault();
		const data = {
			id: this.formEl.id.value,
			parentId: this.formEl.parentId.value,
			name: this.formEl.name.value,
		};

		if (!data.name) return;
		const item = data.id ? this.modifyCategory(data.id, data) : this.addCategory(data);
		this.resetForm();
		this.render();
		this.fireEvent('edit', { action: (data.id ? 'update' : 'add'), item });
	}

	onClick (e) {
		const target = e.target;

		const cat = target.closest('.cat');
		if (cat) {
			const data = cat.dataset;
			e.preventDefault();
			const detail = Object.assign({}, data);
			if (this.edit) return this.editCategory(cat, detail);
			return this.fireEvent('select', detail);
		}

		if (target.closest('.edit-on')) return this.edit = true;
		if (target.closest('.edit-off')) return this.edit = false;
		if (target.closest('.btn-new')) return this.resetForm();
		if (target.closest('.btn-del')) {
			const id = target.closest('form').elements.id.value;
			return this.deleteCategory(id);
		}
	}

	fireEvent (name, detail) {
		this.dispatchEvent(new CustomEvent(name, { detail }));
	}

}

customElements.define('perfect-tree', perfectTree);
