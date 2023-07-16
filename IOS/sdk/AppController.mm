/****************************************************************************
 Copyright (c) 2010-2013 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
 
 http://www.cocos2d-x.org
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

#import "AppController.h"
#import "cocos2d.h"
#import "AppDelegate.h"
#import "RootViewController.h"
#import "SDKWrapper.h"
#import "platform/ios/CCEAGLView-ios.h"



using namespace cocos2d;

//static __strong NSString* storageDir = @"";
//static __strong NSString* recordFilePath = @"";
//static __strong AVAudioRecorder* recorder = nullptr;
//static __strong AVAudioPlayer *avAudioPlayer = nullptr;

static VoiceManager* voiceManager = [VoiceManager shareInstance];

@implementation AppController

Application* app = nullptr;
NSString* kAppId = @"wx02b8313157685a8f";
NSString* kUniversalLinks = @"https://majiang.autoeco.com.cn/";

@synthesize window;

#pragma mark -
#pragma mark Application lifecycle

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    [[SDKWrapper getInstance] application:application didFinishLaunchingWithOptions:launchOptions];
    // Add the view controller's view to the window and display.
    float scale = [[UIScreen mainScreen] scale];
    CGRect bounds = [[UIScreen mainScreen] bounds];
    window = [[UIWindow alloc] initWithFrame: bounds];
    
    // cocos2d application instance
    app = new AppDelegate(bounds.size.width * scale, bounds.size.height * scale);
    app->setMultitouch(true);
    
    // Use RootViewController to manage CCEAGLView
    _viewController = [[RootViewController alloc]init];
#ifdef NSFoundationVersionNumber_iOS_7_0
    _viewController.automaticallyAdjustsScrollViewInsets = NO;
    _viewController.extendedLayoutIncludesOpaqueBars = NO;
    _viewController.edgesForExtendedLayout = UIRectEdgeAll;
#else
    _viewController.wantsFullScreenLayout = YES;
#endif
    // Set RootViewController to window
    if ( [[UIDevice currentDevice].systemVersion floatValue] < 6.0)
    {
        // warning: addSubView doesn't work on iOS6
        [window addSubview: _viewController.view];
    }
    else
    {
        // use this method on ios6
        [window setRootViewController:_viewController];
    }
    
    [window makeKeyAndVisible];
    
    [[UIApplication sharedApplication] setStatusBarHidden:YES];
    [[NSNotificationCenter defaultCenter] addObserver:self
        selector:@selector(statusBarOrientationChanged:)
        name:UIApplicationDidChangeStatusBarOrientationNotification object:nil];
    
    [[[LocationManager alloc] init] startOnceLocation];
    [WXApi registerApp:kAppId universalLink:kUniversalLinks];
    
    //run the cocos2d-x game scene
    app->start();
    
    return YES;
}

- (void)statusBarOrientationChanged:(NSNotification *)notification {
    CGRect bounds = [UIScreen mainScreen].bounds;
    float scale = [[UIScreen mainScreen] scale];
    float width = bounds.size.width * scale;
    float height = bounds.size.height * scale;
    Application::getInstance()->updateViewSize(width, height);
}

- (void)applicationWillResignActive:(UIApplication *)application {
    /*
     Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
     Use this method to pause ongoing tasks, disable timers, and throttle down OpenGL ES frame rates. Games should use this method to pause the game.
     */
    app->onPause();
    [[SDKWrapper getInstance] applicationWillResignActive:application];
}

- (void)applicationDidBecomeActive:(UIApplication *)application {
    /*
     Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
     */
    app->onResume();
    [[SDKWrapper getInstance] applicationDidBecomeActive:application];
}

- (void)applicationDidEnterBackground:(UIApplication *)application {
    /*
     Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
     If your application supports background execution, called instead of applicationWillTerminate: when the user quits.
     */
    [[SDKWrapper getInstance] applicationDidEnterBackground:application];
}

- (void)applicationWillEnterForeground:(UIApplication *)application {
    /*
     Called as part of  transition from the background to the inactive state: here you can undo many of the changes made on entering the background.
     */
    [[SDKWrapper getInstance] applicationWillEnterForeground:application];    
}

- (void)applicationWillTerminate:(UIApplication *)application
{
    [[SDKWrapper getInstance] applicationWillTerminate:application];
    delete app;
    app = nil;
}


#pragma mark -
#pragma mark Memory management

- (void)applicationDidReceiveMemoryWarning:(UIApplication *)application {
    /*
     Free up as much memory as possible by purging cached data objects that can be recreated (or reloaded from disk) later.
     */
}

#pragma mark -
#pragma mark JS Bridge

+ (float)getLongitude
{
    return [LocationManager getLongitude];
}

+ (float)getLatitude
{
    return [LocationManager getLatitude];
}

//+ (NSString*)getCity
//{
//    return [LocationManager getCity];
//}

#pragma mark -
#pragma mark WX Bridge

+ (void)login
{
    SendAuthReq* req = [[[SendAuthReq alloc] init] autorelease];
    req.scope = @"snsapi_userinfo";
    req.state = @"123";
    [WXApi sendAuthReq:req viewController:self delegate:self completion:^(BOOL success) {
        NSLog(@"微信登陆");
    }];
}

+ (NSDictionary *)dictionaryWithJsonString:(NSString *)jsonString
{
    if (jsonString == nil) {
        return nil;
    }
    NSData *jsonData = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
    NSError *err;
    NSDictionary *dic = [NSJSONSerialization JSONObjectWithData:jsonData
    options:NSJSONReadingMutableContainers
    error:&err];
    if (err) {
        NSLog(@"json解析失败：%@",err);
        return nil;
    }
    return dic;
}

+ (void)wxpay:(NSString*)json
{
    NSDictionary *data = [AppController dictionaryWithJsonString:json];
    PayReq* req = [[[PayReq alloc] init] autorelease];
    req.partnerId = [data valueForKey:@"mch_id"];
    req.prepayId = [data valueForKey:@"prepay_id"];
    req.nonceStr = [data valueForKey:@"nonce_str"];
    req.timeStamp = [[data valueForKey:@"timeStamp"] unsignedIntValue];
    req.package = [data valueForKey:@"packageValue"];
    req.sign = [data valueForKey:@"sign"];
    [WXApi sendReq:req completion:^(BOOL success) {
        NSLog(@"微信支付");
    }];
    
}

- (BOOL)application:(UIApplication *)application handleOpenURL:(NSURL *)url {
    return  [WXApi handleOpenURL:url delegate:self];
}

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation {
    return [WXApi handleOpenURL:url delegate:self];
}

- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void(^)(NSArray<id<UIUserActivityRestoring>> * __nullable restorableObjects))restorationHandler
{
    return [WXApi handleOpenUniversalLink:userActivity delegate:self];
}

-(void) onReq:(BaseReq*)reqonReq
{
    
}

-(void) onResp:(BaseResp*)resp
{
    if ([resp isKindOfClass:[SendAuthResp class]]) {
        if (resp.errCode == 0) {
            std::string jsCallStr = cocos2d::StringUtils::format("cc.sdk.onLoginResp(\"%s\");", [((SendAuthResp*)resp).code cStringUsingEncoding:NSUTF8StringEncoding]);
            se::ScriptEngine::getInstance()->evalString(jsCallStr.c_str());
        }
    } else if ([resp isKindOfClass:[PayResp class]]) {
        std::string jsCallStr = cocos2d::StringUtils::format("cc.sdk.onPayResp(%d);", resp.errCode);
        se::ScriptEngine::getInstance()->evalString(jsCallStr.c_str());
    }
}

#pragma mark -
#pragma mark Voice

+ (void)prepareRecord:(NSString*)filename
{
    [[VoiceManager shareInstance] prepareRecord:filename];
//    recordFilePath = [storageDir stringByAppendingPathComponent:[NSString stringWithFormat:@"%@", filename]];
//    NSString *recordWavFilePath = [storageDir stringByAppendingPathComponent:[NSString stringWithFormat:@"%@.wav", filename]];
//    NSLog(@"prepareRecord: %@, fullPath: %@", filename, recordFilePath);
//
//    NSDictionary *recordSetting = [[NSDictionary alloc] initWithObjectsAndKeys:
//                                       [NSNumber numberWithFloat: 8000.0],AVSampleRateKey, //采样率
//                                       [NSNumber numberWithInt: kAudioFormatLinearPCM],AVFormatIDKey,
//                                       [NSNumber numberWithInt:16],AVLinearPCMBitDepthKey,//采样位数 默认 16
//                                       [NSNumber numberWithInt: 1], AVNumberOfChannelsKey,//通道的数目
//                                       //                                   [NSNumber numberWithBool:NO],AVLinearPCMIsFloatKey,//采样信号是整数还是浮点数
//                                       //                                   [NSNumber numberWithInt: AVAudioQualityMedium],AVEncoderAudioQualityKey,//音频编码质量
//                                       nil];
//
//        //初始化录音
//
//    recorder = [[AVAudioRecorder alloc]initWithURL:[NSURL fileURLWithPath:recordWavFilePath]
//                                                   settings:recordSetting
//                                                      error:nil];
//    if ([recorder prepareToRecord]){
//
//        [[AVAudioSession sharedInstance] setCategory: AVAudioSessionCategoryPlayAndRecord error:nil];
//        [[AVAudioSession sharedInstance] setActive:YES error:nil];
//
//            //开始录音
//        if ([recorder record]){
//            //UI操作
//        }
//    }else{
//        NSLog(@"音频格式出错,Recorder---%@", recorder);
//    }
}

+ (void)finishRecord
{
    [[VoiceManager shareInstance] finishRecord];
//    NSLog(@"finishRecord: %@", recordFilePath);
//    if (recorder != nil && [recorder isRecording] && ![recordFilePath isEqual: @""]){
//        //停止录音
//        [recorder stop];
//
//        NSString *wavPath = [recordFilePath stringByAppendingPathExtension:@"wav"];
//        if ([VoiceConvert ConvertWavToAmr:wavPath amrSavePath:recordFilePath]) {
//            //UI操作 播放音频
//        } else {
//            NSLog(@"amr转wav 转换失败");
//        }
//
//    }
}

+ (void)cancelRecord
{
    [[VoiceManager shareInstance] cancelRecord];
//    NSLog(@"cancelRecord.");
//    [self finishRecord];
}

+ (void)playVoice:(NSString*)filename
{
    [[VoiceManager shareInstance] playVoice:filename];
//    NSLog(@"playVoic: %@", filename);
//    NSString *amrFilePath = [storageDir stringByAppendingPathComponent:[NSString stringWithFormat:@"%@", filename]];
//    NSString *wavFilePath = [storageDir stringByAppendingPathComponent:[NSString stringWithFormat:@"%@.wav", filename]];
//    if ([VoiceConvert ConvertAmrToWav:amrFilePath wavSavePath:wavFilePath]) {
//        NSURL *fileUrl = [NSURL URLWithString:wavFilePath];
//        avAudioPlayer = [[AVAudioPlayer alloc]initWithContentsOfURL:fileUrl error:nil];
//            [[AVAudioSession sharedInstance] setCategory:AVAudioSessionCategoryPlayback error:nil];
//        // 3.打印歌曲信息
//        //    NSString *msg = [NSString stringWithFormat:@"音频文件声道数:%ld\n 音频文件持续时间:%g",audioPlayer.numberOfChannels,audioPlayer.duration];
//        // 4.设置循环播放
//        avAudioPlayer.numberOfLoops = 0;
//        avAudioPlayer.volume = 1;
//        avAudioPlayer.delegate = self;
//        // 5.开始播放
//        [avAudioPlayer play];
//    } else {
//        NSLog(@"amr转wav 转换失败");
//    }
}

+ (void)stopVoice
{
    [[VoiceManager shareInstance] stopVoice];
//    NSLog(@"stopVoice");
//    if (avAudioPlayer != nil) {
//        [avAudioPlayer stop];
//        avAudioPlayer = nil;
//        //avAudioPlayer.delegate = nil;
//    }
}

+ (void)setStorageDir:(NSString*)dir
{
    NSLog(@"zzzzzzzzz %@", dir);
    NSLog(@"qqqqqqqqq %@", voiceManager);
    [voiceManager setStorageDir:dir];
//    storageDir = dir;
}

//+(NSString*)GetPathByFileName:(NSString *)_fileName ofType:(NSString *)_type
//{
//    NSString* fileDirectory = [[[storageDir stringByAppendingPathComponent:_fileName]
//                                stringByAppendingPathExtension:_type]
//                               stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
//    return fileDirectory;
//}

@end
