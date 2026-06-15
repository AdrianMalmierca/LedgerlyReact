#import "ExpenseChartView.h"

@implementation ExpenseChartView

- (void)setData:(NSDictionary *)data {
  _data = data;
  [self setNeedsDisplay];
}

- (void)drawRect:(CGRect)rect { //when the view is drawn, this method is called to draw the chart
  if (!_data || _data.count == 0) return;

  CGContextRef context = UIGraphicsGetCurrentContext();

  NSArray *keys = [_data allKeys]; //get all the keys (categories) from the data dictionary
  NSInteger count = keys.count;
  CGFloat barWidth = (rect.size.width - 32) / count; //32 is the padding on both sides (16 each)
  CGFloat maxValue = 0;

  for (NSString *key in keys) {
    CGFloat val = [_data[key] floatValue];
    if (val > maxValue) maxValue = val;
  }

  if (maxValue == 0) return;

  NSArray *colors = @[
    [UIColor systemBlueColor],
    [UIColor systemGreenColor],
    [UIColor systemOrangeColor],
    [UIColor systemPurpleColor],
  ];

  for (NSInteger i = 0; i < count; i++) { //for each category, draw the bar and the label
    NSString *key = keys[i]; //get the actual key
    CGFloat value = [_data[key] floatValue];
    CGFloat barHeight = (value / maxValue) * (rect.size.height - 60); //proportional height based on the max value, 60 is for padding for labels
    CGFloat x = 16 + i * barWidth + barWidth * 0.1;
    CGFloat width = barWidth * 0.8;
    CGFloat y = rect.size.height - 40 - barHeight;

    UIColor *color = colors[i % colors.count];
    CGContextSetFillColorWithColor(context, color.CGColor);
    CGContextFillRect(context, CGRectMake(x, y, width, barHeight));

    //Label
    NSDictionary *attrs = @{ //to creates NSDictionary with attributes for the label text
      NSFontAttributeName: [UIFont systemFontOfSize:10],
      NSForegroundColorAttributeName: [UIColor labelColor],
    };
    NSString *label = key; //category text
    CGSize labelSize = [label sizeWithAttributes:attrs];
    CGFloat labelX = x + (width - labelSize.width) / 2;
    [label drawAtPoint:CGPointMake(labelX, rect.size.height - 28) withAttributes:attrs];

    //Value
    NSString *valueStr = [NSString stringWithFormat:@"%.0f€", value];
    CGSize valueSize = [valueStr sizeWithAttributes:attrs];
    CGFloat valueX = x + (width - valueSize.width) / 2;
    [valueStr drawAtPoint:CGPointMake(valueX, y - 16) withAttributes:attrs];
  }
}

@end