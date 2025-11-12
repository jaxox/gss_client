/**
 * Jest setup for GSS Mobile React Native app
 */

// Basic setup without external dependencies

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
  getAllKeys: jest.fn(() => Promise.resolve([])),
  multiGet: jest.fn(() => Promise.resolve([])),
  multiSet: jest.fn(() => Promise.resolve()),
  multiRemove: jest.fn(() => Promise.resolve()),
}));

// Mock Google Sign In
jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    configure: jest.fn(),
    hasPlayServices: jest.fn(() => Promise.resolve(true)),
    signIn: jest.fn(() =>
      Promise.resolve({ user: { email: 'test@example.com' } }),
    ),
    signOut: jest.fn(() => Promise.resolve()),
    isSignedIn: jest.fn(() => Promise.resolve(false)),
    getCurrentUser: jest.fn(() => Promise.resolve(null)),
  },
  GoogleSigninButton: 'GoogleSigninButton',
  statusCodes: {
    SIGN_IN_CANCELLED: '0',
    IN_PROGRESS: '1',
    PLAY_SERVICES_NOT_AVAILABLE: '2',
  },
}));

// Mock React Native modules
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  const React = require('react');

  // Mock Alert
  RN.Alert.alert = jest.fn();

  // Mock Linking
  RN.Linking.openURL = jest.fn(() => Promise.resolve());
  RN.Linking.canOpenURL = jest.fn(() => Promise.resolve(true));

  // Mock Share
  RN.Share = {
    share: jest.fn(() => Promise.resolve({ action: 'sharedAction' })),
  };

  // Ensure Switch is available
  if (!RN.Switch) {
    RN.Switch = 'Switch';
  }

  // Mock SafeAreaView
  RN.SafeAreaView = ({ children, ...props }) =>
    React.createElement(RN.View, props, children);

  return RN;
});

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  const insets = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }) => children,
    SafeAreaView: ({ children }) => children,
    useSafeAreaInsets: () => insets,
    useSafeAreaFrame: () => ({ x: 0, y: 0, width: 390, height: 844 }),
    SafeAreaInsetsContext: {
      Consumer: ({ children }) => children(insets),
    },
  };
});

// Mock react-native-paper - keep it minimal
jest.mock('react-native-paper', () => {
  const React = require('react');
  const RN = jest.requireActual('react-native');
  const RNPaper = jest.requireActual('react-native-paper');

  // Create simple mock Appbar components that won't break
  const MockAppbarHeader = ({ children, ...props }) =>
    React.createElement(
      RN.View,
      { ...props, testID: 'appbar-header' },
      children,
    );
  const MockAppbarBackAction = ({ onPress, ...props }) =>
    React.createElement(RN.TouchableOpacity, {
      ...props,
      onPress,
      testID: 'appbar-back',
    });
  const MockAppbarContent = ({ title, ...props }) =>
    React.createElement(RN.Text, { ...props, testID: 'appbar-content' }, title);
  const MockAppbarAction = ({ onPress, icon, ...props }) =>
    React.createElement(RN.TouchableOpacity, {
      ...props,
      onPress,
      testID: 'appbar-action',
    });

  // Create mock TextInput with Icon property
  const MockTextInputIcon = ({ icon, ...props }) =>
    React.createElement(RN.View, {
      ...props,
      testID: `text-input-icon-${icon}`,
    });

  // Get the real TextInput and add our mock Icon
  const RealTextInput = RNPaper.TextInput || RN.TextInput;
  const MockTextInput = Object.assign(
    props => React.createElement(RealTextInput, props),
    { Icon: MockTextInputIcon },
  );

  return {
    ...RNPaper,
    Portal: ({ children }) => children,
    Provider: ({ children }) => children,
    TextInput: MockTextInput,
    Appbar: {
      ...(RNPaper.Appbar || {}),
      Header: MockAppbarHeader,
      BackAction: MockAppbarBackAction,
      Content: MockAppbarContent,
      Action: MockAppbarAction,
    },
  };
});

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  // Uncomment to ignore a specific log level
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock react-native-vector-icons
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => {
  const React = require('react');
  const MockIcon = props => React.createElement('Icon', props);
  MockIcon.displayName = 'MockIcon';
  return MockIcon;
});

// Setup global test utilities
global.__DEV__ = true;

// Mock fetch for API testing
global.fetch = jest.fn();

// Setup test environment variables
process.env.NODE_ENV = 'test';
