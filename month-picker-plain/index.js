import {Component} from './component.js';

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function btnTemplate (month, i) {
	return `<button class="month month-${i + 1}"
		data-value="${i + 1}">${month.substr(0, 3)}</button>`;
}



export default class MonthPicker extends Component {

	init () {
		this.el.classList.add('month-picker');
		this.value = new Date().getMonth() + 1;
	}

	template () {
		return months.map(btnTemplate).join('');
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
			const val = btn.dataset.value;
			this.value = val;
			this.fire('change', { value: parseInt(val, 10), month: months[val - 1] });
		}
	}

}
