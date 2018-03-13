const style = `
.calendar { --first-day: 1; -moz-user-select: none; user-select: none; cursor: default; width: inherit; position: relative; font: normal 1em sans-serif; }
.calendar .day-card { padding: 20px 0 32px; margin-bottom: 2px; text-align: center; background: #cee; }
.calendar h1, .calendar h2 { margin: 0; line-height: 1; font: inherit; text-transform: uppercase; }
.calendar h1 { font-size: 4.6em; }
.calendar nav { list-style: none; padding: 0; margin: 0; display: grid; grid-gap: 0; grid-template-columns: repeat(7, 1fr); }
.calendar a { padding: 5px 5px 3px 0; text-align: right; color: inherit; text-decoration: none; }
.calendar .months { display: flex; justify-content: space-between; overflow: hidden; margin: -20px 0 0; padding: 0 5px; }
.calendar .months a { padding: 3px 0; }
.calendar .weekdays { border-top: 1px solid #888; border-bottom: 1px solid #888; }
.calendar .weekdays a { background: #ccc; }
.calendar .months a, .calendar .days a { cursor: pointer; }
.calendar .months a:hover, .calendar .days a:hover { color: #9bf; }
.calendar .selected { font-weight: bold; color: blue !important; }
.days-28 .day-29, .days-28 .day-30, .days-28 .day-31,
.days-29 .day-30, .days-29 .day-31,
.days-30 .day-31 { display: none; }
.calendar .day-1 { grid-column-start: var(--first-day); }
.year { display: flex; align-items: stretch; justify-content: end; position: absolute; top: 5px; left: 0; right: 0; }
.year .filler { flex: 1; }
.year button { background: none; border: none; cursor: pointer; border-radius: 3px; }
.year button:hover { color: blue; }
.year span { display: flex; align-items: center; align-content: center; padding-top: 3px; margin: 0 3px; }
`;

const template = `<div class="calendar"><div class="day-card"></div>
	<div class="year">
		<button class="today" title="Go to today">Today</button>
		<div class="filler"></div>
		<button class="prev-year" title="Previous year">◀</button>
		<span>2018</span>
		<button class="next-year" title="Next year">▶</button>
	</div>
	<nav class="months"></nav><nav class="weekdays"></nav><nav class="days"></nav>
</div>`;

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

class perfectCalendar extends HTMLElement {

	constructor () {
		super();
		this.template = document.createElement('template');
		this.template.innerHTML = `<style>${style}</style>${template}`;
		this.templateContent = this.template.content;
	}

	static get observedAttributes () { return ['date']; }

	connectedCallback () {
		this.attachShadow({ mode: 'open' });
		this.shadowRoot.appendChild(this.templateContent.cloneNode(true));
		this.el = this.shadowRoot.querySelector('.calendar');
		this.dayCard = this.el.querySelector('.day-card');

		this.monthsEl = this.el.querySelector('.months');
		this.weekdaysEl = this.el.querySelector('.weekdays');
		this.daysEl = this.el.querySelector('.days');
		this.fillCalendar();

		this.el.addEventListener('click', this.onClick.bind(this));
		if (!this.getAttribute('date')) this.date = new Date();
	}

	attributeChangedCallback(name, oldVal, newVal) {
		if (name === 'date') this.upDate(newVal);
	}

	set date (val) {
		if (typeof val !== 'string') val = this.format(val);
		this.setAttribute('date', val);
	}

	get date () { return this.getAttribute('date'); }

	get fullDate () {
		const date = new Date(this.date);
		return Object.assign({}, this.dateObj, { date, dateStr: this.date });
	}

	// yyyy-mm-dd
	format (d) { return d.toISOString().substr(0, 10); }

	upDate (date) {
		date = date || this.getAttribute('date');
		if (!date || !this.el) return;
		this.realDate = new Date(date);

		const y = this.realDate.getFullYear();
		const m = this.realDate.getMonth();
		const d = this.realDate.getDate();
		const month = months[m];
		const firstDayOfMonth = new Date(Date.UTC(y, m, 1)).getDay() || 7;	// make Sun 7 not 0
		const daysInMonth = new Date(Date.UTC(y, m + 1, 0)).getDate();
		const weekday = weekdays[(this.realDate.getDay() || 7) - 1];
		this.dateObj = { y, m, d, month, firstDayOfMonth, daysInMonth, weekday };
		this.render();
	}

	render () {
		this.el.style.setProperty('--first-day', this.dateObj.firstDayOfMonth);
		this.el.className = 'calendar days-' + this.dateObj.daysInMonth;
		this.dayCard.innerHTML = this.getDayCard();
		this.el.querySelector('.year span').innerText = this.dateObj.y;

		if (this.selectedDay) this.selectedDay.classList.remove('selected');
		this.selectedDay = this.daysEl.querySelector('.day-' + this.dateObj.d);
		this.selectedDay.classList.add('selected');

		if (this.selectedMonth) this.selectedMonth.classList.remove('selected');
		this.selectedMonth = this.monthsEl.querySelectorAll('a')[this.dateObj.m];
		this.selectedMonth.classList.add('selected');
	}

	getDayCard () { return `<h1>${this.dateObj.d}</h1><h2>${this.dateObj.weekday}</h2>`; }

	fillCalendar () {
		this.monthsEl.innerHTML = months.map(m => `<a href="#${m}">${m.substr(0, 3)}</a>`).join('');
		this.weekdaysEl.innerHTML = weekdays.map(m => `<a>${m.substr(0, 3)}</a>`).join('');
		const days = Array(31).fill(0).map((n, i) => i + 1).map(i => `<a href="#${i}" class="day-${i}">${i}</a>`);
		this.daysEl.innerHTML = days.join('');
	}

	setDate (y = this.dateObj.y, m = this.dateObj.m, d = this.dateObj.d) {
		if (y instanceof Date) return this.setDate(y.getFullYear(), y.getMonth(), y.getDate());
		const date = new Date(Date.UTC(y, m, d));
		if (date !== this.realDate) {
			this.date = date;
			this.dispatchEvent(new CustomEvent('change', { detail: this.fullDate }));
		}
	}

	onClick (e) {
		const target = e.target;
		const dayEl = target.closest('.days a');
		if (dayEl) {
			const dayEls = this.daysEl.children;
			const day = Array.prototype.indexOf.call(dayEls, dayEl) + 1;
			e.preventDefault();
			return this.setDate(undefined, undefined, day);
		}

		const monthEl = target.closest('.months a');
		if (monthEl) {
			const monthsEls = monthEl.parentNode.children;
			const month = Array.prototype.indexOf.call(monthsEls, monthEl);
			e.preventDefault();
			return this.setDate(undefined, month);
		}

		const today = target.closest('.today');
		if (today) return this.setDate(new Date());

		const prevYear = target.closest('.prev-year');
		if (prevYear) return this.setDate(this.dateObj.y - 1);

		const nextYear = target.closest('.next-year');
		if (nextYear) return this.setDate(this.dateObj.y + 1);
	}

}

customElements.define('perfect-calendar', perfectCalendar);
