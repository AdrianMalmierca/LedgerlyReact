#import "CategoryBadgeView.h"

@implementation CategoryBadgeView {
  UILabel *_label;
}

- (instancetype)initWithFrame:(CGRect)frame { //view constructor
  self = [super initWithFrame:frame];
  if (self) {
    _label = [[UILabel alloc] init];
    _label.textAlignment = NSTextAlignmentCenter;
    _label.font = [UIFont systemFontOfSize:13 weight:UIFontWeightSemibold];
    _label.textColor = [UIColor whiteColor];
    [self addSubview:_label];
    self.layer.cornerRadius = 12;
    self.clipsToBounds = YES; //to make sure the label doesn't overflow the badge view
  }
  return self;
}

- (void)layoutSubviews { //called when the view changes size
  [super layoutSubviews];
  _label.frame = self.bounds; //make the label fill the entire badge view
}

- (void)setCategory:(NSString *)category {
  _category = category;
  _label.text = category;
}

- (void)setBadgeColor:(NSString *)badgeColor {
  _badgeColor = badgeColor;
  self.backgroundColor = [self colorFromHex:badgeColor];
}

- (UIColor *)colorFromHex:(NSString *)hex {
  unsigned int rgb = 0;
  NSScanner *scanner = [NSScanner scannerWithString:[hex stringByReplacingOccurrencesOfString:@"#" withString:@""]];
  [scanner scanHexInt:&rgb]; //transforms the hex string into an integer
  return [UIColor colorWithRed:((rgb >> 16) & 0xFF) / 255.0
                         green:((rgb >> 8) & 0xFF) / 255.0
                          blue:(rgb & 0xFF) / 255.0
                         alpha:1.0];
}

@end