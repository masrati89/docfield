import Constants from 'expo-constants';

const isDev = __DEV__ || Constants.appOwnership === 'expo';

export const logger = {
  log: (...args: unknown[]) => {
    // eslint-disable-next-line no-console
    if (isDev) console.log(...args);
  },
  warn: (...args: unknown[]) => {
    if (isDev) console.warn(...args);
  },
  error: (...args: unknown[]) => {
    if (isDev) console.error(...args);
  },
};
