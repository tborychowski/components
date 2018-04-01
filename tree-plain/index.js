import {Component} from './component.js';
import templates from './templates.js';
import util from './util.js';


export default class Tree extends Component {

	init () {
		this.editboxEl = this.el.querySelector('.edit-box');
		this.treeEl = this.el.querySelector('.tree-content');
		this.formEl = this.el.querySelector('.edit-form');

		this.formEl.addEventListener('submit', this.onSubmit.bind(this));
	}

	template () { return templates.tree(); }

	set edit (val) {
		this.isInEdit = Boolean(val);
		this.el.classList.toggle('edit', this.isInEdit);
	}

	get edit () { return this.isInEdit; }

	get data () { return this._data; }

	set data (data) {
		if (util.isTree(data)) this._data = util.treeToArray(data);
		else this._data = data;
		this.render();
	}


	render () {
		util.sort(this._data);
		this.treeEl.innerHTML = templates.items(util.arrayToTree(this._data));
		this.formEl.parentId.innerHTML = templates.catDropdown(this._data);
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
		this.fire('edit', { action: 'delete', item });
	}


	onSubmit (e) {
		e.preventDefault();
		const data = {
			id: this.formEl.id.value,
			parentId: this.formEl.parentId.value,
			name: this.formEl.name.value,
		};

		if (!data.name) return;
		const item = data.id ? util.updateArrayItem(this._data, data.id, data) : this.addCategory(data);
		this.resetForm();
		this.render();
		this.fire('edit', { action: (data.id ? 'update' : 'add'), item });
	}

	onClick (e) {
		const target = e.target;

		const cat = target.closest('.cat');
		if (cat) {
			const data = cat.dataset;
			e.preventDefault();
			const detail = Object.assign({}, data);
			if (this.edit) return this.editCategory(cat, detail);
			return this.fire('select', detail);
		}

		if (target.closest('.edit-on')) return this.edit = true;
		if (target.closest('.edit-off')) return this.edit = false;
		if (target.closest('.btn-new')) return this.resetForm();
		if (target.closest('.btn-del')) {
			const id = target.closest('form').elements.id.value;
			return this.deleteCategory(id);
		}
	}

}

