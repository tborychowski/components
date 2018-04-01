const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

class MonthPickerButton extends React.Component {
	render() {
		const {month, idx, selected} = this.props;
		const cls = ['month',
			`month-${month.toLowerCase()}`,
			`month-${idx}`,
			(selected ? 'selected' : '')
		];
		const props = { className: cls.join(' '), onClick: () => this.props.onClick() };
		return <button {...props}>{month.substr(0, 3)}</button>;
	}
}


class MonthPicker extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			selected: new Date().getMonth() + 1
		};
	}

	render() {
		return (
			<div className="month-picker">
				{months.map((month, i) => {
					const idx = i + 1;
					const selected = (idx === this.state.selected);
					const onClick = () => this.setState({ selected: idx })
					const props = { month, idx, key: idx, selected, onClick }
					return <MonthPickerButton {...props} />;
				})}
			</div>
		);
	}
}
