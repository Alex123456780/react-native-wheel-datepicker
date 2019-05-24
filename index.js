'use strict';

// import { Platform } from 'react-native';
import Picker from './src/picker';
import DatePicker from './src/date-picker';

// let DatePickerComponent = DatePicker;

// const registerCustomDatePickerIOS = (CustomDatePickerIOS) => {
//   if (Platform.OS === 'ios') {
//     DatePickerComponent = CustomDatePickerIOS;
//   }

//   return DatePickerComponent;
// };

export {
  Picker,
  DatePicker,
  // DatePickerComponent as DatePicker,
  // registerCustomDatePickerIOS,
};