//
//  VoiceManager.m
//  majiang-mobile
//
//  Created by mac on 2023/7/16.
//

#import <Foundation/Foundation.h>

#import "VoiceManager.h"


static VoiceManager *mInstace = nil;

@implementation VoiceManager

+ (instancetype)shareInstance {
    if (mInstace == nil) {
        mInstace = [[self alloc] init];
    }
//    static dispatch_once_t onceToken;
//    dispatch_once(&onceToken, ^{
//        mInstace = [[super allocWithZone:NULL] init];
//    });
    return mInstace;
}
//+ (id)allocWithZone:(struct _NSZone *)zone {
//    return [VoiceManager shareInstance];
//}
//
//+ (id)copyWithZone:(struct _NSZone *)zone {
//    return [VoiceManager shareInstance];
//}
- (instancetype)init
{
    self = [super init];
    if (self) {
        self.recordFilePath = [[NSString alloc] initWithString:@""];
        self.storageDir = [[NSString alloc] initWithString:@""];
        self.avAudioPlayer = nil;
        self.recorder = nil;
    }
    return self;
}

- (void)prepareRecord:(NSString*)filename
{
    NSString* amrFilePath = [[NSString alloc] initWithString:voiceStorageDir];
    NSString* wavFilePath = [[NSString alloc] initWithString:voiceStorageDir];
    NSLog(@"prepareRecord: %@, storageDir: %@", filename, voiceStorageDir);
    self.recordFilePath = [amrFilePath stringByAppendingPathComponent:[NSString stringWithFormat:@"%@", filename]];
    NSString *recordWavFilePath = [wavFilePath stringByAppendingPathComponent:[NSString stringWithFormat:@"%@.wav", filename]];
    NSLog(@"prepareRecord: %@, fullPath: %@", filename, self.recordFilePath);
        
    NSDictionary *recordSetting = [[NSDictionary alloc] initWithObjectsAndKeys:
                                       [NSNumber numberWithFloat: 8000.0],AVSampleRateKey, //采样率
                                       [NSNumber numberWithInt: kAudioFormatLinearPCM],AVFormatIDKey,
                                       [NSNumber numberWithInt:16],AVLinearPCMBitDepthKey,//采样位数 默认 16
                                       [NSNumber numberWithInt: 1], AVNumberOfChannelsKey,//通道的数目
                                       //                                   [NSNumber numberWithBool:NO],AVLinearPCMIsFloatKey,//采样信号是整数还是浮点数
                                       //                                   [NSNumber numberWithInt: AVAudioQualityMedium],AVEncoderAudioQualityKey,//音频编码质量
                                       nil];
        
        //初始化录音
        
    self.recorder = [[AVAudioRecorder alloc]initWithURL:[NSURL fileURLWithPath:recordWavFilePath]
                                                   settings:recordSetting
                                                      error:nil];
    if ([self.recorder prepareToRecord]){
            
        [[AVAudioSession sharedInstance] setCategory: AVAudioSessionCategoryPlayAndRecord error:nil];
        [[AVAudioSession sharedInstance] setActive:YES error:nil];
            
            //开始录音
        if ([self.recorder record]){
            //UI操作
        }
    }else{
        NSLog(@"音频格式出错,Recorder---%@", self.recorder);
    }
}

- (void)finishRecord
{
    NSLog(@"finishRecord: %@", self.recordFilePath);
    if (self.recorder != nil && [self.recorder isRecording] && ![self.recordFilePath isEqual: @""]){
        //停止录音
        [self.recorder stop];
        
        NSString *amrPath = [[NSString alloc] initWithString:self.recordFilePath];
        NSString *wavPath = [[NSString alloc] initWithString:self.recordFilePath];
        wavPath = [wavPath stringByAppendingPathExtension:@"wav"];
        
        if ([VoiceConvert ConvertWavToAmr:wavPath amrSavePath:amrPath]) {
            //UI操作 播放音频
        } else {
            NSLog(@"amr转wav 转换失败");
        }

    }
}

- (void)cancelRecord
{
    NSLog(@"cancelRecord.");
    [self finishRecord];
}

- (void)playVoice:(NSString*)filename
{
    if (voiceStorageDir == nil || [voiceStorageDir isEqual:@""]) {
        NSLog(@"playVoice Fail: voiceStorageDir is nil, filename: %@", filename);
        NSLog(@"playVoice Fail: self: %@", self);
        return;
    }
    NSLog(@"playVoice: %@, filename: %@", voiceStorageDir, filename);
    NSString *amrFilePath = [[NSString alloc] initWithString:voiceStorageDir];
    NSString *wavFilePath = [[NSString alloc] initWithString:voiceStorageDir];
    amrFilePath = [amrFilePath stringByAppendingPathComponent:[NSString stringWithFormat:@"%@", filename]];
    wavFilePath = [wavFilePath stringByAppendingPathComponent:[NSString stringWithFormat:@"%@.wav", filename]];
    NSLog(@"playVoice: %@, %@", amrFilePath, wavFilePath);
    if ([VoiceConvert ConvertAmrToWav:amrFilePath wavSavePath:wavFilePath]) {
        NSURL *fileUrl = [NSURL URLWithString:wavFilePath];
        self.avAudioPlayer = [[AVAudioPlayer alloc]initWithContentsOfURL:fileUrl error:nil];
            [[AVAudioSession sharedInstance] setCategory:AVAudioSessionCategoryPlayback error:nil];
        // 3.打印歌曲信息
        //    NSString *msg = [NSString stringWithFormat:@"音频文件声道数:%ld\n 音频文件持续时间:%g",audioPlayer.numberOfChannels,audioPlayer.duration];
        // 4.设置循环播放
        self.avAudioPlayer.numberOfLoops = 0;
        self.avAudioPlayer.volume = 1;
        //self.avAudioPlayer.delegate = self;
        // 5.开始播放
        [self.avAudioPlayer play];
    } else {
        NSLog(@"amr转wav 转换失败");
    }
}

- (void)stopVoice
{
    NSLog(@"stopVoice");
    if (self.avAudioPlayer != nil) {
        [self.avAudioPlayer stop];
        self.avAudioPlayer = nil;
        //avAudioPlayer.delegate = nil;
    }
}

- (void)setStorageDir:(NSString*)dir
{
    NSLog(@"setStorageDir: %@", dir);
    NSString* val = [NSString stringWithFormat:@"%@", dir];
    val = [val stringByReplacingOccurrencesOfString:@"//" withString:@"/"];
    if (val == nil || [val isEqual: @""]) {
        return;
    }
    NSLog(@"-----------: %@", val);
//    self.storageDir = val;
    voiceStorageDir = val;
}


@end
