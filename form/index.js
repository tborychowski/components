const style = `
.form {
	width: inherit;
	position: relative;
	font: normal 1em sans-serif;
}
`;

const template = `<form>
</form>`;

function getOptionHtml (opt) {
	return `<option value="${opt.id}">${opt.name}</option>`;
}

function getGroupHtml (grp) {
	console.log(grp);
	if (!grp.items) return '';
	const options = grp.items.map(getOptionHtml).join('');
	return `<optgroup label="${grp.name}">${options}</optgroup>`;
}


function getRow (categories, idx = 0) {
	const options = categories.map(getGroupHtml).join('');
	let btns = idx === 0 ?
		'<button type="button" title="Split" class="btn-split"><i class="fa fa-angle-double-down"></i>split</button>' :
		'<button type="button" title="Remove" class="btn-unsplit"><i class="fa fa-trash-o"></i>remove</button>';

	return `<div class="form-row">
		<input type="hidden" name="items[${idx}]id">
		<input type="hidden" name="items[${idx}]date">
		<div class="select-wrap">
			<select name="items[${idx}]category_id" class="category">${options}</select>
		</div>
  			<input name="items[${idx}]description" class="description" placeholder="description" value="">
		<input name="items[${idx}]amount" class="amount" placeholder="0.00">
		${btns}
	</div>`;
}



class expForm extends HTMLElement {

	constructor () {
		super();
		this.template = document.createElement('template');
		this.template.innerHTML = `<style>${style}</style>${template}`;
		this.templateContent = this.template.content;
	}

	connectedCallback () {
		this.attachShadow({ mode: 'open' });
		this.shadowRoot.appendChild(this.templateContent.cloneNode(true));
		this.el = this.shadowRoot.querySelector('form');

		this.el.addEventListener('click', this.onClick.bind(this));
		this.el.addEventListener('submit', this.onSubmit.bind(this));
	}


	get categories () { return this._categories; }

	set categories (categories) {
		this._categories = categories;
	}


	resetForm () {
		this.el.reset();
	}

	split (idx = this.el.querySelectorAll('.form-row').length) {
		const row = getRow(this._categories, idx);
		if (idx === 0) this.el.innerHTML = row;
		else this.el.insertAdjacentHTML('beforeend', row);
	}

	unsplit (row) {
		row.remove();
	}

	onSubmit (e) {
		e.preventDefault();
		this.resetForm();
		this.fireEvent('submit', {  });
	}

	onClick (e) {
		const target = e.target;

		if (target.closest('.btn-reset')) return this.resetForm();
		if (target.closest('.btn-split')) return this.split();
		if (target.closest('.btn-unsplit')) return this.unsplit(target.closest('.form-row'));
	}

	fireEvent (name, detail) {
		this.dispatchEvent(new CustomEvent(name, { detail }));
	}

}

customElements.define('exp-form', expForm);
