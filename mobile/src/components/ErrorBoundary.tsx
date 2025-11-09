import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import { logJsError } from '../utils/jsLogger';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🔴 ERROR BOUNDARY CAUGHT:', error);
    console.error('🔴 ERROR INFO:', errorInfo);
    console.error('🔴 ERROR STACK:', error.stack);
    console.error('🔴 COMPONENT STACK:', errorInfo.componentStack);
    // Autonomous native + file logging
    logJsError({
      source: 'boundary',
      name: error.name,
      message: error.message,
      stack: (error.stack || '')
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean),
      componentStack: errorInfo.componentStack || undefined,
    });

    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <ScrollView style={styles.scrollView}>
            <Text style={styles.title}>Something went wrong</Text>
            <Text style={styles.errorText}>{this.state.error?.toString()}</Text>
            <Text style={styles.stackTitle}>
              (Logged natively with subsystem com.gssclient.js)
            </Text>
            <Text style={styles.stackTitle}>Stack Trace:</Text>
            <Text style={styles.stackText}>{this.state.error?.stack}</Text>
            <Text style={styles.stackTitle}>Component Stack:</Text>
            <Text style={styles.stackText}>
              {this.state.errorInfo?.componentStack}
            </Text>
            <Button
              mode="contained"
              onPress={() =>
                this.setState({ hasError: false, error: null, errorInfo: null })
              }
              style={styles.button}
            >
              Try Again
            </Button>
          </ScrollView>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  scrollView: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    marginBottom: 16,
    fontFamily: 'monospace',
  },
  stackTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  stackText: {
    fontSize: 12,
    fontFamily: 'monospace',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 4,
  },
  button: {
    marginTop: 24,
  },
});

export default ErrorBoundary;
