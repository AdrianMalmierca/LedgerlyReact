import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  getDeviceName(): Promise<string>;
  getSystemVersion(): Promise<string>;
  getAppVersion(): Promise<string>;
}

export default TurboModuleRegistry.get<Spec>('DeviceInfoModule');