// JSLoggerModuleBridge.m
// Objective-C bridge exporting Swift JSLoggerModule to React Native classic bridge
// Uses RCT_EXTERN macros so Swift class need not include explicit RCTBridgeModule protocol implementation.

#import <React/RCTBridgeModule.h>
#import <React/RCTLog.h>

@interface RCT_EXTERN_MODULE(JSLoggerModule, NSObject)
RCT_EXTERN_METHOD(logError:(NSString *)payload)
@end
