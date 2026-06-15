import { NativeModules } from 'react-native';

const { NotificationModule } = NativeModules;

export default {
  requestPermission: (): Promise<boolean> => {
    return NotificationModule.requestPermission();
  },
  showNotification: (title: string, body: string): void => {
    NotificationModule.showNotification(title, body);
  },
};