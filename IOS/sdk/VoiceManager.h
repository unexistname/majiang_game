//
//  VoiceManager.h
//  majiang-mobile
//
//  Created by mac on 2023/7/16.
//

#ifndef VoiceManager_h
#define VoiceManager_h
#import "VoiceConvert.h"
#import <AVFoundation/AVFoundation.h>
#import <AudioToolbox/AudioToolbox.h>

static NSString *voiceStorageDir = nil;

@interface VoiceManager : NSObject
{
    
}

@property(strong,nonatomic) NSString* storageDir;
@property(strong,nonatomic) NSString* recordFilePath;
@property(strong,nonatomic) AVAudioRecorder* recorder;
@property(strong,nonatomic) AVAudioPlayer *avAudioPlayer;

+ (instancetype)shareInstance;

- (void)prepareRecord:(NSString*)filename;

- (void)finishRecord;

- (void)cancelRecord;

- (void)playVoice:(NSString*)filename;

- (void)stopVoice;

- (void)setStorageDir:(NSString*)dir;
@end

#endif /* VoiceManager_h */
