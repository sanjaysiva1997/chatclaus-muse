
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.b784d01fe7834fbd9a9cacf761f0575a',
  appName: 'chatclaus-muse',
  webDir: 'dist',
  server: {
    url: 'https://b784d01f-e783-4fbd-9a9c-acf761f0575a.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
      keystorePassword: undefined,
      keystoreAliasPassword: undefined,
    },
  },
};

export default config;
