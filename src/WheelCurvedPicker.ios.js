import React, { PureComponent } from 'react';
import { PickerIOS } from 'react-native';

// https://github.com/sjha07/React-Native-PickerIOS-Example/blob/master/index.ios.js - Example

class WheelCurvedPicker extends PureComponent {
  render() {
    const {
      children,
      selectedValue,
      onValueChange,
      ...otherProps
    } = this.props;
    return (
      <PickerIOS
        {...otherProps}
        selectedValue={selectedValue}
        onValueChange={onValueChange}
      >
        {children}
      </PickerIOS>
    )
  }
}

WheelCurvedPicker.Item = PickerIOS.Item;

export default WheelCurvedPicker;