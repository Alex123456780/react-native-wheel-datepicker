import React, { PureComponent } from 'react';
import { ColorPropType, requireNativeComponent, View, ViewPropTypes as RNViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';

import {
    emptyFunction,
} from './Utils'

const ViewPropTypes = RNViewPropTypes || View.propTypes;

const stateFromProps = (props) => {

  const {
    children,
    selectedIndex,
  } = props;

  const items = children.map(({ props: { value, label } }) => {
    return { value, label };
  });

  return {
    items,
    index: parseInt(selectedIndex, 10),
  };
};

class WheelCurvedPicker extends PureComponent {
  static propTypes = {
    ...ViewPropTypes,
    selectedIndex: PropTypes.number,
    onValueChange: PropTypes.func,
    textColor: ColorPropType,
    textSize: PropTypes.number,
    itemSpace: PropTypes.number,
  };

  static defaultProps = {
    selectedIndex: 0,
    advancedIndex: null,
    onValueChange: emptyFunction,
    textSize: 26,
    itemSpace: 20,
    textColor: '#333',
  };

  constructor(props) {
    super(props);

    const {
      advancedIndex,
    } = props;
    if (advancedIndex || advancedIndex === 0) {
      this.current_dependent_pos = advancedIndex;
    }

    this.state = stateFromProps(props);
  }

  onValueChange = ({ nativeEvent: { index, value } }) => {
    const {
      advancedIndex,
      onValueChange,
    } = this.props;
    if (advancedIndex || advancedIndex === 0) {
      if (advancedIndex === this.current_dependent_pos) {
        onValueChange(value/*, index*/);
      }
      else {
        this.current_dependent_pos = advancedIndex;
      }
    }
    else {
      onValueChange(value/*, index*/);
    }
  };

  static getDerivedStateFromProps(nextProps) {
    return stateFromProps(nextProps)
  }

  render() {
    const {
      children,
      selectedIndex,
      ...otherProps
    } = this.props;

    return (
      <WheelCurvedPickerNative
        {...otherProps}
        onValueChange={this.onValueChange}
        data={this.state}
        selectedIndex={parseInt(selectedIndex, 10)}
      />
    );
  }
}

class Item extends PureComponent {
  static propTypes = {
    value: PropTypes.any.isRequired,
    label: PropTypes.string.isRequired,
  };

  // These items don't get rendered directly.
  render() {
    return null
  };
}

WheelCurvedPicker.Item = Item;

const WheelCurvedPickerNative = requireNativeComponent('WheelCurvedPicker', WheelCurvedPicker);

export default WheelCurvedPicker;