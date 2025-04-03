// Theme configuration for the Ustat AI mobile app
import { MD3LightTheme } from 'react-native-paper';
import colors from './colors';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary.main,
    primaryContainer: colors.primary.light,
    secondary: colors.secondary.main,
    secondaryContainer: colors.secondary.light,
    error: colors.error.main,
    errorContainer: colors.error.light,
    background: colors.background.default,
    surface: colors.background.paper,
    onSurface: colors.text.primary,
    onSurfaceVariant: colors.text.secondary,
    onPrimary: colors.primary.contrastText,
    onSecondary: colors.secondary.contrastText,
    onError: colors.error.contrastText,
  },
  roundness: 8,
};

export default theme; 