import {Component} from './component.js';

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


class monthPicker extends Component {

	init () {
		this.addEventListener('click', this.onClick.bind(this));
	}

	data () {
		return {
			month: new Date().getMonth() + 1
		};
	}

	buttonTemplate (month, i) {
		return `<button class="month month-${i + 1}" data-value="${i + 1}">${month.substr(0, 3)}</button>`;
	}

	template () {
		return months.map(this.buttonTemplate).join('');
	}

	update (data) {
		this.querySelectorAll('.selected').forEach(btn => btn.classList.remove('selected'));
		this.querySelector('.month-' + data.month).classList.add('selected');
	}

	onClick (e) {
		const target = e.target;
		const monthButton = target.closest('.month');
		if (monthButton) {
			const month = parseInt(monthButton.dataset.value, 10);
			this.set({ month });
			this.fire('change');
		}
	}
}

customElements.define('month-picker', monthPicker);
