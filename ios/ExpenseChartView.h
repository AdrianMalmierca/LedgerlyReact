#import <UIKit/UIKit.h>

@interface ExpenseChartView : UIView
@property (nonatomic, copy) NSDictionary *data;
//noatomic doesnt use locks between threads
//copy to create a copy so that the original data cannot be modified from outside the class
@end