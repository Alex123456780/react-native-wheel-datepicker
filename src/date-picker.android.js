import React, { PureComponent } from 'react';
import {
  ColorPropType,
  StyleSheet,
  View,
  ViewPropTypes as RNViewPropTypes,
} from 'react-native';
import PropTypes from 'prop-types';

import Picker from './picker';
import {
  pickerDateArray,
  increaseDateByDays,
  getDatePosition,
  emptyFunction,
  dateToString,
  getTimezoneOffset,
} from './Utils'

const ViewPropTypes = RNViewPropTypes || View.propTypes;

const stylesFromProps = props => ({
  itemSpace: props.itemSpace,
  textColor: props.textColor,
  textSize: props.textSize,
  style: props.style,
});

//TODO:
// 4) Add advanced functionality:
// -) https://github.com/kievu/react-native-wheel-datepicker/commit/96a861d5278ab0a668d0bb0471fac02161e84757
// -) https://github.com/lesliesam/react-native-wheel-picker/issues/45 (iOS too)

// -) https://github.com/lesliesam/react-native-wheel-picker/pull/8/commits/a02d958e37b4290aee57439f7b24b751e65eb600
// -) https://github.com/Reliantid/react-native-wheel-datepicker/commit/979a9311ca6ccd89c940317c59733f73183cfd68
// -) https://github.com/nyur321/react-native-wheel-datepicker/commit/9913203b61392d871d57bce71caa7d8507eb65c7
// -) https://github.com/nyur321/react-native-wheel-datepicker/commit/b0a4ab7e8bbcac0e66b64443e0c1ce3003a3b2aa

// -) https://github.com/nyur321/react-native-wheel-datepicker/commit/e1117daf4114c97e40a1c6df2408b7000be09f9f 

export default class DatePicker extends PureComponent {
  static propTypes = {
    //TODO: order_time_list propTypes
    date: PropTypes.string,
    onDateChange: PropTypes.func,
    style: ViewPropTypes.style,
    textColor: ColorPropType,
    textSize: PropTypes.number,
    itemSpace: PropTypes.number,
    user_timezone: PropTypes.number,
  };

  static defaultProps = {
    //TODO: order_time_list defaultProps
    date: '',
    onDateChange: emptyFunction,
    style: null,
    textColor: '#333',
    textSize: 26,
    itemSpace: 20,
    user_timezone: -(new Date().getTimezoneOffset() / 60),
  };

  constructor(props) {
    super(props);
    const {
      date,
      order_time_list,
      user_timezone,
      hour_offset,
    } = props;
    const current_timezone = -(new Date().getTimezoneOffset() / 60);
    const offset = getTimezoneOffset(current_timezone, user_timezone);
    const date_in_ms = date ? Date.parse(new Date(date)) - offset : Date.now() + hour_offset;

    const {
      init_day_pos,
      chosen_date,
      days_arr,
    } = pickerDateArray(date_in_ms, offset);

    const {
      chosen_day_pos = 0,
      chosen_hour_pos = 0,
      chosen_minute_pos = 0,
      chosen_day = 0,
      chosen_minutes_value = 'start_hour',
    } = getDatePosition(
      order_time_list,
      chosen_date.getDay(),
      chosen_date.getHours(),
      chosen_date.getMinutes(),
      init_day_pos
    );

    this.time_offset = offset;
    this.hour_offset = hour_offset;

    this.order_time_list = order_time_list;
    this.days = days_arr;
    // this.max_hour_pos = chosen_hour_pos;
    // this.max_minute_pos = chosen_minute_pos;

    this.state = {
      chosen_day: chosen_day,
      chosen_minutes_value: chosen_minutes_value,
      chosen_day_pos: chosen_day_pos,
      chosen_hour_pos: chosen_hour_pos,
      chosen_minute_pos: chosen_minute_pos,
    }
  }

  componentDidMount() {
    this.getDate();
  }

  getDate = () => {
    const {
      chosen_day,
      chosen_day_pos,
      chosen_hour_pos,
      chosen_minutes_value,
      chosen_minute_pos,
    } = this.state;
    let new_date = increaseDateByDays(chosen_day_pos, this.time_offset);
    const chosen_day_time = this.order_time_list[`${chosen_day}`];

    new_date.setHours(chosen_day_time.hours[chosen_hour_pos]);
    new_date.setMinutes(chosen_day_time.minutes[`${chosen_minutes_value}`][chosen_minute_pos]);

    const canChooseDate = !(Date.parse(new_date) < Date.now() + this.time_offset + this.hour_offset);
    this.props.onDateChange(
      dateToString(new_date,'-'),
      dateToString(new_date,'/'),
      canChooseDate,
      this.time_offset,
    );
  }

  onDaySelected = (value, position = 0) => {
    if (position !== this.state.chosen_day_pos) {
      // let new_chosen_minutes_value = '';
      // let new_chosen_hour_pos = 0;
      const new_chosen_day = increaseDateByDays(position, this.time_offset).getDay();
      // const new_chosen_day_hours_list_size = this.order_time_list[`${new_chosen_day}`].hours.length - 1;
      // if (new_chosen_day_hours_list_size >= this.max_hour_pos) {
      //   new_chosen_hour_pos = this.max_hour_pos;
      //   if (this.max_hour_pos === 0) {
      //     new_chosen_minutes_value = 'start_hour';
      //   }
      //   else if (new_chosen_day_hours_list_size === this.max_hour_pos) {
      //     new_chosen_minutes_value = 'end_hour';
      //   }
      //   else {
      //     new_chosen_minutes_value = 'middle_hour';
      //   }
      // }
      // else {
      //   new_chosen_hour_pos = new_chosen_day_hours_list_size;
      //   new_chosen_minutes_value = 'end_hour';
      // }

      this.setState(state => ({
        chosen_day: new_chosen_day,
        chosen_minutes_value: 'start_hour',//new_chosen_minutes_value,
        chosen_day_pos: position,
        chosen_hour_pos: 0,//new_chosen_hour_pos,
        chosen_minute_pos: 0,
      }), () => {
        this.getDate();
      })
    }
  }


  onHourSelected = (value, position = 0) => {
    const {
      chosen_hour_pos,
      chosen_day,
    } = this.state;
    if (position !== chosen_hour_pos) {
      let new_chosen_minutes_value = '';
      const current_hour_list_size = this.order_time_list[`${chosen_day}`].hours.length - 1;

      if (position === 0) {
        new_chosen_minutes_value = 'start_hour';
      }
      else if (current_hour_list_size === position) {
        new_chosen_minutes_value = 'end_hour';
      }
      else {
        new_chosen_minutes_value = 'middle_hour';
      }

      // this.max_hour_pos = position;
      this.setState(state => ({
        chosen_minutes_value: new_chosen_minutes_value,
        chosen_hour_pos: position,
        chosen_minute_pos: 0,
      }), () => {
        this.getDate();
      })
    }
  };

  onMinuteSelected = (value, position = 0) => {
    if (position !== this.state.chosen_minute_pos) {
      this.setState(state => ({
        chosen_minute_pos: position,
      }), () => {
        this.getDate();
      })
    }
  };

  render() {
    const {
      chosen_day,
      chosen_minutes_value,
      chosen_day_pos,
      chosen_hour_pos,
      chosen_minute_pos,
    } = this.state;

    const propsStyles = stylesFromProps(this.props);
    return (
      <View style={styles.row}>
        <View style={styles.picker}>
          <Picker
            {...propsStyles}
            selectedIndex={chosen_day_pos}
            pickerData={this.days}
            onValueChange={this.onDaySelected}
          />
        </View>
        <View style={styles.picker}>
          <Picker
            {...propsStyles}
            advancedIndex={chosen_day_pos}
            selectedIndex={chosen_hour_pos}
            pickerData={this.order_time_list[`${chosen_day}`].hours}
            onValueChange={this.onHourSelected}
          />
        </View>
        <View style={styles.picker}>
          <Picker
            {...propsStyles}
            advancedIndex={chosen_hour_pos}
            selectedIndex={chosen_minute_pos}
            pickerData={this.order_time_list[`${chosen_day}`].minutes[`${chosen_minutes_value}`]}
            onValueChange={this.onMinuteSelected}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  picker: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
});