import {Component} from './component.js';

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


export default class MonthPicker extends Component {

	init () {
		this.el.classList.add('month-picker');
		this.value = new Date().getMonth() + 1;
	}

	buttonTemplate (month, i) {
		return `<button class="month month-${i + 1}"
			data-value="${i + 1}">${month.substr(0, 3)}</button>`;
	}

	template () {
		return months.map(this.buttonTemplate).join('');
	}

	set value (value) {
		this._value = value;
		this.update(value);
	}

	get value () { return this._value; }

	update (value) {
		let selected = this.el.querySelectorAll('.month.selected');
		selected.forEach(btn => btn.classList.remove('selected'));
		selected = this.el.querySelector('.month-' + value);
		if (selected) selected.classList.add('selected');
	}

	onClick (e) {
		const btn = e.target.closest('.month');
		if (btn) {
			const value = parseInt(btn.dataset.value, 10);
			this.value = value;
			this.fire('change', { value, month: months[value - 1] });
		}
	}

}
