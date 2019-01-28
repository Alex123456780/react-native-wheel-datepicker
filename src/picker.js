import React, { Component } from 'react';
import {
  ColorPropType,
  StyleSheet,
  View,
  ViewPropTypes as RNViewPropTypes,
} from 'react-native';
import PropTypes from 'prop-types';

import WheelCurvedPicker from './WheelCurvedPicker';
import {
  emptyFunction,
} from './Utils'

const ViewPropTypes = RNViewPropTypes || View.propTypes;

const PickerItem = WheelCurvedPicker.Item;

// https://github.com/sjha07/React-Native-PickerIOS-Example/blob/master/index.ios.js - Example
export default class Picker extends Component {
  static propTypes = {
    selectedIndex: PropTypes.number,
    pickerData: PropTypes.array,
    onValueChange: PropTypes.func,
    textColor: ColorPropType,
    textSize: PropTypes.number,
    itemSpace: PropTypes.number,
    itemStyle: ViewPropTypes.style,
    style: ViewPropTypes.style,
  };

  static defaultProps = {
    selectedIndex: 0,
    advancedIndex: null,
    pickerData: ["00"],
    onValueChange: emptyFunction,
    textColor: '#333',
    textSize: 26,
    itemSpace: 20,
    itemStyle: null,
    style: null,
  };

  handleChange = (selectedValue) => {
    this.props.onValueChange(selectedValue);
  };

  render() {
    const {
      pickerData,
      selectedIndex,
      advancedIndex,
      style,
      ...props
    } = this.props;

    return (
      <WheelCurvedPicker
        {...props}
        style={[styles.picker, style]}
        onValueChange={this.handleChange}
        selectedIndex={selectedIndex}
        advancedIndex={advancedIndex}
      >
        {pickerData.map((data, index) => (
          <PickerItem
            key={`${data + index}`}
            value={data}
            label={`${data}`}
          />
        ))}
      </WheelCurvedPicker>
    );
  }
}

const styles = StyleSheet.create({
  picker: {
    backgroundColor: '#ffffff',
    height: 220,
  },
});