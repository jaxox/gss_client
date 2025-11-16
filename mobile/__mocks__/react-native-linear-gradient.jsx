// Mock for react-native-linear-gradient
import React from 'react';
import { View } from 'react-native';

const LinearGradient = ({ children, ...props }) => {
  return <View {...props}>{children}</View>;
};

export default LinearGradient;
