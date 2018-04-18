import {Component} from './component.js';



class yearPicker extends Component {

	init () {
		this.inputEl = this.querySelector('input');
		this.inputEl.addEventListener('change', e => e.stopPropagation());
		this.inputEl.addEventListener('input', this.onInput.bind(this));
		this.addEventListener('click', this.onClick.bind(this));
	}

	data () {
		return { year: new Date().getFullYear() };
	}

	template () {
		return `<div class="year-picker">
			<button class="prev-year" title="Previous year" data-go="-1">◀</button>
			<input type="number">
			<button class="next-year" title="Next year" data-go="1">▶</button>
		</div>`;
	}

	update ({year}) {
		this.inputEl.value = year;
	}

	addToValue (val) {
		const year = this.get('year') + val;
		this.set({ year });
		this.fire('change');
	}

	onInput () {
		const currentYear = this.get('year');
		const year = parseInt(this.inputEl.value, 10);
		if (currentYear !== year) {
			this.set({ year });
			this.fire('change');
		}
	}

	onClick (e) {
		const go = parseInt(e.target.dataset.go, 10);
		if (isNaN(go)) return;
		const year = this.get('year') + go;
		this.set({ year });
		this.fire('change');
	}

}

customElements.define('year-picker', yearPicker);
