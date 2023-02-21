Need to add "else {
   [super displayLayer: layer];
 }
}" to if statement in the #pragma mark - CALayerDelegate

File path: node_modules/react-native/Libraries/Image/RCTUIImageViewAnimated.m




#pragma mark - CALayerDelegate

- (void)displayLayer:(CALayer *)layer
{
  if (_currentFrame) {
    layer.contentsScale = self.animatedImageScale;
    layer.contents = (__bridge id)_currentFrame.CGImage;
  }else {
    [super displayLayer: layer];
  }
}