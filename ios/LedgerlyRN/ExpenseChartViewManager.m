#import "ExpenseChartViewManager.h"
#import "ExpenseChartView.h"

@implementation ExpenseChartViewManager

RCT_EXPORT_MODULE(ExpenseChartView) //register the module with React Native

- (UIView *)view {
  return [[ExpenseChartView alloc] init];
}

RCT_EXPORT_VIEW_PROPERTY(data, NSDictionary)

@end