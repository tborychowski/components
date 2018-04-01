import {Component} from './component.js';

export default class YearPicker extends Component {

	init () {
		this.inputEl = this.el.querySelector('input');
		this.inputEl.addEventListener('input', this.onInput.bind(this));
		this.value = new Date().getFullYear();
	}

	template () {
		return `<div class="year-picker">
			<button class="prev-year" title="Previous year" data-go="-1">◀</button>
			<input type="number">
			<button class="next-year" title="Next year" data-go="1">▶</button>
		</div>`;
	}

	get value () { return this._value; }
	set value (value) {
		this._value = parseInt('' + value, 10);
		this.inputEl.value = value;
	}

	onInput () {
		const inputValue = parseInt(this.inputEl.value, 10);
		if (isNaN(inputValue)) return this.inputEl.value = '';
		if (this._value === inputValue) return;
		this.value = inputValue;
		this.fire('change', { value: inputValue });
	}

	onClick (e) {
		const go = parseInt(e.target.dataset.go, 10);
		if (isNaN(go)) return;
		this.value = this._value + go;
		this.fire('change', { value: this.value });
	}

}
