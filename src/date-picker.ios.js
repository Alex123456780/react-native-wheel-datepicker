import React, { PureComponent } from 'react';
import { DatePickerIOS } from 'react-native';
import PropTypes from 'prop-types';

export default class DatePicker extends PureComponent {
  static propTypes = {
    date: PropTypes.instanceOf(Date),
    minimumDate: PropTypes.instanceOf(Date),
    maximumDate: PropTypes.instanceOf(Date),
    mode: PropTypes.oneOf(['date', 'time', 'datetime']),
    onDateChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    mode: 'date',
    date: new Date(),
  };

  constructor(props) {
    super(props);
    this.state = {
      date: props.date
    }
  }

  // state = {
  //   date: null,
  // };

  // componentWillMount() {
  //   this.setState({ date: this.props.date });
  // }

  // componentDidMount() {
  //   this.setState({ date: this.props.date });
  // }

  // componentWillReceiveProps({ date }) {
  //   this.setState({ date });
  // }

  componentDidUpdate(prevProps) {
    if (this.props.date !== prevProps.date) {
      this.setState({ date: this.props.date })
    }
  }

  // static getDerivedStateFromProps(nextProps, prevState) {
  //   if (prevState.date !== nextProps.date) {
  //     return { date: nextProps.date }
  //   }
  //   else return null;
  // }

  onDateChange = (date) => {
    this.setState({ date });
    this.props.onDateChange(date);
  };

  render() {
    return (
      <DatePickerIOS
        {...this.props}
        onDateChange={this.onDateChange}
        date={this.state.date}
      />
    );
  }

  getValue() {
    return this.state.date;
  }
}