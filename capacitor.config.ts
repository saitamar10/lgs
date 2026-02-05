import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lgscalis.app',
  appName: 'LGS Çalış',
  webDir: 'dist',
  plugins: {
    AdMob: {
      appId: 'ca-app-pub-7677556382140668~9079779944', // Android App ID
      // iOS App ID will be configured in Info.plist
      testingDevices: ['YOUR_DEVICE_ID_HERE'], // Remove this in production
      initializeForTesting: false // Set to false in production
    }
  }
};

export default config;
