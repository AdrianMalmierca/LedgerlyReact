#import "CategoryBadgeViewManager.h"
#import "CategoryBadgeView.h"

@implementation CategoryBadgeViewManager

RCT_EXPORT_MODULE(CategoryBadgeView)

- (UIView *)view {
  return [[CategoryBadgeView alloc] init];
}

RCT_EXPORT_VIEW_PROPERTY(category, NSString)
RCT_EXPORT_VIEW_PROPERTY(badgeColor, NSString)

@end