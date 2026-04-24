import { Component, type ReactNode } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { COLORS, BORDER_RADIUS } from '@infield/ui';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    if (__DEV__) {
      console.error('[ErrorBoundary]', error);
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <View style={styles.iconWrap}>
            <Feather
              name="alert-triangle"
              size={48}
              color={COLORS.warning[500]}
            />
          </View>
          <Text style={styles.title}>שגיאה לא צפויה</Text>
          <Text style={styles.subtitle}>
            משהו השתבש. נסה לרענן את האפליקציה.
          </Text>
          <Pressable style={styles.button} onPress={this.handleRetry}>
            <Feather name="refresh-cw" size={18} color={COLORS.white} />
            <Text style={styles.buttonText}>נסה שוב</Text>
          </Pressable>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream[50],
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  iconWrap: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Rubik-Bold',
    color: COLORS.neutral[800],
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: 'Rubik-Regular',
    color: COLORS.neutral[500],
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 22,
  },
  button: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.primary[500],
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: BORDER_RADIUS.md,
  },
  buttonText: {
    fontSize: 15,
    fontFamily: 'Rubik-SemiBold',
    color: COLORS.white,
  },
});
