#import "DeviceInfoModule.h"
#import <UIKit/UIKit.h>

@implementation DeviceInfoModule

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(getDeviceName:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  dispatch_async(dispatch_get_main_queue(), ^{ //on the main thread because UIDevice is from UIKit so a lot of
  //APIs from UIKit should be called on the main thread
    NSString *name = [[UIDevice currentDevice] name];
    resolve(name);
  });
}

RCT_EXPORT_METHOD(getSystemVersion:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  NSString *version = [[UIDevice currentDevice] systemVersion];
  resolve(version);
}

RCT_EXPORT_METHOD(getAppVersion:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  NSString *version = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleShortVersionString"];
  resolve(version ?: @"1.0.0");
}

@end