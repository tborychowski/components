const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


class MonthPicker extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			selected: new Date().getMonth() + 1
		};
	}

	onclick (selected) {
		this.setState({ selected });
	}

	render() {
		return (
			<div className="month-picker">
				{months.map((month, i) => {
					const key = i + 1;
					const cls = `month ${key === this.state.selected ? 'selected' : ''}`;
					const onClick = () => this.onclick(key);
					return <button key={key} className={cls} onClick={onClick}>{month.substr(0, 3)}</button>;
				})}
			</div>
		);
	}
}
