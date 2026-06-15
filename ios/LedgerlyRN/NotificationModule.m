#import "NotificationModule.h"
#import <UserNotifications/UserNotifications.h>

@implementation NotificationModule

RCT_EXPORT_MODULE(); //exposes the module to React Native

RCT_EXPORT_METHOD(requestPermission:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) //exposes the requestPermission method to Javascript
{
  UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter]; //get the current notification center
  [center requestAuthorizationWithOptions:(UNAuthorizationOptionAlert | UNAuthorizationOptionSound | UNAuthorizationOptionBadge)
                        completionHandler:^(BOOL granted, NSError * _Nullable error) {
    if (error) {
      reject(@"permission_error", @"Error requesting permission", error);
    } else {
      resolve(@(granted));
    }
  }];
}

RCT_EXPORT_METHOD(showNotification:(NSString *)title
                  body:(NSString *)body)
{
  UNMutableNotificationContent *content = [[UNMutableNotificationContent alloc] init];
  content.title = title;
  content.body = body;
  content.sound = [UNNotificationSound defaultSound];

  UNTimeIntervalNotificationTrigger *trigger =
    [UNTimeIntervalNotificationTrigger triggerWithTimeInterval:1 repeats:NO];

  NSString *identifier = [[NSUUID UUID] UUIDString];
  UNNotificationRequest *request =
    [UNNotificationRequest requestWithIdentifier:identifier
                                         content:content
                                         trigger:trigger];

  [[UNUserNotificationCenter currentNotificationCenter] //get the current notification center
    addNotificationRequest:request
    withCompletionHandler:nil];
}

@end