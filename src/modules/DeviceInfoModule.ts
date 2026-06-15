import NativeDeviceInfoModule from './NativeDeviceInfoModule';

export default {
  getDeviceName: (): Promise<string> => {
    return NativeDeviceInfoModule?.getDeviceName() ?? Promise.resolve('Unknown');
  },
  getSystemVersion: (): Promise<string> => {
    return NativeDeviceInfoModule?.getSystemVersion() ?? Promise.resolve('Unknown');
  },
  getAppVersion: (): Promise<string> => {
    return NativeDeviceInfoModule?.getAppVersion() ?? Promise.resolve('1.0.0');
  },
};