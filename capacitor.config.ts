import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  plugins: {
    Camera: {
      allowEditing: false,
      saveToGallery: false,
      resultType: 'base64'
    }
  }
};

export default config;
