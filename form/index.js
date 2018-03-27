import keys from './keys.js';

const style = `
.flex-filler { flex: 1; }
.form {
	width: inherit;
	position: relative;
	font: inherit;
	border: 1px solid #ccc;
}

.form-row { display: flex; align-items: center; padding: 10px; }
.form-row-repeat { }
.form-row-repeat input { width: 40px; margin: 0 5px; text-align: center; }
.form-row-repeat { background: #eee; }
.form-row-repeat label { line-height: 20px; display: block; }

.form-row-buttons { background: #eee; border-top: 1px solid #ccc; }
.form-row-buttons button { margin-left: 5px; }
.form-row-buttons button:first-child { margin-left: 0; }

.btn-remove,
.btn-cancel,
.btn-save,
.update .btn-add { display: none; }

.update .btn-remove,
.update .btn-cancel,
.update .btn-save { display: block; }


.subforms { background: #ccc; }
.subforms .form-row { justify-content: stretch; }
.subforms .form-row:first-child { background: #eee; }
.subforms .category { width: 140px; }
.subforms .description { flex: 1; }
.subforms .amount { width: 100px; text-align: right; }
.subforms button { width: 40px; overflow: hidden; }
.subforms .form-row select,
.subforms .form-row input { margin-right: 5px; }
`;


const template = `<form class="form">
	<div class="subforms"></div>
	<div class="form-row form-row-repeat">
		<label>Repeat every month, for </label>
		<input class="repeater" min="1" max="12" name="repeat" type="number" value="1">
		<label> months</label>
	</div>
	<div class="form-row form-row-buttons">
		<button type="button" class="btn-remove">Remove</button>
		<div class="flex-filler"></div>
		<button type="button" class="btn-cancel">Cancel</button>
		<button type="submit" class="btn-save">Save</button>
		<button type="submit" class="btn-add">Add</button>
	</div>
</form>`;

function getOptionHtml (opt) {
	return `<option value="${opt.id}">${opt.name}</option>`;
}

function getGroupHtml (grp) {
	if (!grp.items) return '';
	const options = grp.items.map(getOptionHtml).join('');
	return `<optgroup label="${grp.name}">${options}</optgroup>`;
}


function getRow (categories, idx = 0, description = '') {
	const options = categories.map(getGroupHtml).join('');
	let btns = idx === 0 ?
		'<button type="button" title="Split" class="btn-split"><i class="fa fa-angle-double-down"></i>split</button>' :
		'<button type="button" title="Remove" class="btn-unsplit"><i class="fa fa-trash-o"></i>remove</button>';

	return `<div class="form-row">
		<input type="hidden" name="id">
		<select name="category_id" class="category">${options}</select>
  		<input name="description" class="description" placeholder="description" value="${description}">
		<input name="amount" class="amount" placeholder="0.00">
		${btns}
	</div>`;
}


function parseAmount (amount) {
	/* eslint no-eval: 0 */
	amount = ('' + amount).replace(/\s/g, '');
	if (!(/^[+\-\\*/()\d.]+$/i).test(amount)) return 0;
	if ((/[+\-\\*/.]+/i).test(amount)) {
		try { amount = eval(amount); }
		catch (e) { amount = 0; }
	}
	return parseFloat(amount) || 0;
}

	// yyyy-mm
function getStrDate (y, m) {
	return `${y}-${('0' + m).substr(-2)}`;
}


function parseDateStr (dateStr) {
	let [year, month] = dateStr.split('-');
	year = parseInt(year, 10);
	month = parseInt(month, 10);
	const str = getStrDate(year, month);
	return { year, month, str };
}


function deepCopyArray (arr) {
	return arr.map(o => Object.assign({}, o));
}


function addMonthsToDate (date, monthDiff) {
	const dateObj = parseDateStr(date);
	let year = dateObj.year;
	let month = dateObj.month + monthDiff;
	if (month >=13) {
		year = year + Math.floor(month / 12);
		month = (month % 12) + 1;
	}
	return getStrDate(year, month);
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
		this.repeatEl = this.el.querySelector('.repeater');
		this.subforms = this.el.querySelector('.subforms');

		this.el.addEventListener('click', this.onClick.bind(this));
		this.el.addEventListener('submit', this.onSubmit.bind(this));
		this.el.addEventListener('input', this.onFormChange.bind(this));

	}


	get categories () { return this._categories; }
	set categories (categories) { this._categories = categories; }

	get date () { return this._date.str; }
	set date (date) { this._date = parseDateStr(date); }


	resetForm () {
		this.el.reset();
		this.subforms.querySelectorAll('.form-row').forEach(row => row.remove());
		this.split();
	}

	init () {
		this.split();
	}

	split (idx = this.subforms.querySelectorAll('.form-row').length) {
		if (idx === 0) this.subforms.innerHTML = getRow(this._categories, idx);
		else {
			const desc = this.subforms.querySelector('.form-row:first-child .description').value;
			this.subforms.insertAdjacentHTML('beforeend', getRow(this._categories, idx, desc));
		}
		const formEl = this.subforms.querySelector('.form-row:last-child');
		const amountInput = formEl.querySelector('.amount');
		amountInput.addEventListener('keydown', this.onKeyDown.bind(this));
		formEl.querySelector('.category').focus();
	}

	unsplit (row) {
		row.remove();
		this.onFormChange();
	}

	onFormChange () {
		this.fireEvent('change', { data: this.getData() });
	}


	getRowData (row) {
		const category = row.querySelector('.category').value;
		const description = row.querySelector('.description').value;
		const amount = parseAmount(row.querySelector('.amount').value);
		return {category, description, amount, date: this.date };
	}


	getData () {
		const rows = this.subforms.querySelectorAll('.form-row');
		let entries = Array.from(rows).map(this.getRowData.bind(this));

		// subtract other amounts from the first row
		const amounts = entries.map((item, i) => i > 0 ? item.amount : 0);
		const sum = amounts.reduce((a, b) => a + b, 0);	// add all up
		entries[0].amount -= sum;

		// repeat monthly
		const repeater = parseInt(this.repeatEl.value, 10);
		if (repeater) {
			const originalEntries = deepCopyArray(entries);
			for (let i = 1; i < repeater; i++) {
				const newRows = this.cloneEntries(originalEntries, i);
				entries = entries.concat(newRows);
			}
		}
		return entries;
	}


	cloneEntries (entries, monthDiff) {
		return deepCopyArray(entries).map(item => {
			item.date = addMonthsToDate(item.date, monthDiff);
			return item;
		});
	}


	onSubmit (e) {
		e.preventDefault();
		this.fireEvent('submit', { data: this.getData() });
		this.resetForm();
	}

	onClick (e) {
		const target = e.target;
		if (target.closest('.btn-reset')) return this.resetForm();
		if (target.closest('.btn-split')) return this.split();
		if (target.closest('.btn-unsplit')) return this.unsplit(target.closest('.form-row'));
	}


	onKeyDown (e) {
		if (e.key === 'Enter') return true;
		if (keys.isAllowed(e)) return true;
		e.preventDefault();
	}


	fireEvent (name, detail) {
		this.dispatchEvent(new CustomEvent(name, { detail }));
	}

}

customElements.define('exp-form', expForm);
