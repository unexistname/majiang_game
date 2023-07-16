import AudioMgr from "../Controller/Game/AudioMgr";
import VoiceEncry from "./VoiceEncry";


export default class VoiceMgr {

    private static _ins: VoiceMgr;
    public static get ins() {
        if (this._ins == null) {
            this._ins = new VoiceMgr();
        }
        // 写在这是因为IOS按home键就会清除数据，不设置的话底层就会报错，另外这个源码也很奇怪不去保存到js，保存到native干嘛
        this._ins.init();
        return this._ins;
    }

    private ANDROID_API = "com/autoeco/majiang/Anysdk";
    private IOS_API = "AppController";

    _voiceMediaPath: string;

    init() {
        if(cc.sys.isNative){
            this._voiceMediaPath = jsb.fileUtils.getWritablePath() + "/voicemsgs/";
            this.setStorageDir(this._voiceMediaPath);
        }
    }

    isAndroid() {
        return cc.sys.os == cc.sys.OS_ANDROID;
    }

    isIOS() {
        return cc.sys.os == cc.sys.OS_IOS;
    }
    
    prepare(filename){
        if(!cc.sys.isNative){
            return;
        }
        AudioMgr.ins.pauseAll();
        this.clearCache(filename);
        if (this.isAndroid()) {
            jsb.reflection.callStaticMethod(this.ANDROID_API, "prepareRecord", "(Ljava/lang/String;)V",filename);
        } else if (this.isIOS()) {
            jsb.reflection.callStaticMethod(this.IOS_API, "prepareRecord:",filename);
        }
    }
    
    release(){
        if(!cc.sys.isNative){
            return;
        }
        AudioMgr.ins.resumeAll();
        if (this.isAndroid()) {
            jsb.reflection.callStaticMethod(this.ANDROID_API, "finishRecord", "()V");
        } else if (this.isIOS()) {
            // @ts-ignore
            jsb.reflection.callStaticMethod(this.IOS_API, "finishRecord");
        }
    }
    
    cancel(){
        if(!cc.sys.isNative){
            return;
        }
        AudioMgr.ins.resumeAll();
        if (this.isAndroid())  {
            jsb.reflection.callStaticMethod(this.ANDROID_API, "cancelRecord", "()V");
        } else if(cc.sys.os == cc.sys.OS_IOS){
            // @ts-ignore
            jsb.reflection.callStaticMethod(this.IOS_API, "cancelRecord");
        }
    }

    writeVoice(filename, voiceData){
        if (!cc.sys.isNative) {
            return;
        }
        if (voiceData && voiceData.length > 0) {
            let fileData = VoiceEncry.ins.decode(voiceData);
            let url = this._voiceMediaPath + filename;
            this.clearCache(filename);
            // @ts-ignore
            jsb.fileUtils.writeDataToFile(fileData,url); 
        }
    }
    
    clearCache(filename) {
        if (cc.sys.isNative) {
            let url = this._voiceMediaPath + filename;
            //console.log("check file:" + url);
            if(jsb.fileUtils.isFileExist(url)){
                //console.log("remove:" + url);
                jsb.fileUtils.removeFile(url);
            }
            if(jsb.fileUtils.isFileExist(url + ".wav")){
                //console.log("remove:" + url + ".wav");
                jsb.fileUtils.removeFile(url + ".wav");
            }   
        }
    }
    
    play(filename) {
        if (!cc.sys.isNative) {
            return;
        }
        AudioMgr.ins.pauseAll();
        if (this.isAndroid()) {
            jsb.reflection.callStaticMethod(this.ANDROID_API, "playVoice", "(Ljava/lang/String;)V", filename); 
        } else if (this.isIOS()) {
            jsb.reflection.callStaticMethod(this.IOS_API, "playVoice:", filename);
        }
    }
    
    stop() {
        if (!cc.sys.isNative) {
            return;
        }
        AudioMgr.ins.resumeAll();
        if (this.isAndroid()) {
            jsb.reflection.callStaticMethod(this.ANDROID_API, "stopVoice", "()V"); 
        } else if (this.isIOS()) {
            // @ts-ignore
            jsb.reflection.callStaticMethod(this.IOS_API, "stopVoice");
        }
    }
    
    getVoiceLevel(maxLevel){
        return Math.floor(Math.random() * maxLevel + 1);
        /*if (this.isAndroid()) { 
            return jsb.reflection.callStaticMethod(this.ANDROID_API, "getVoiceLevel", "(I)I",maxLevel);
        } else if (this.isIOS()) {
        }
        else{
            return Math.floor(Math.random() * maxLevel + 1);
        }*/
    }
    
    getVoiceData(filename){
        if (cc.sys.isNative) {
            let url = this._voiceMediaPath + filename;
            console.log("getVoiceData:" + url);
            // @ts-ignore
            let fileData = jsb.fileUtils.getDataFromFile(url);
            if (fileData) {
                return VoiceEncry.ins.encode(fileData);
            }
        }
        return "";
    }
    
    download(){
        
    }
    
    setStorageDir(dir){
        if (!cc.sys.isNative) {
            return;
        }
        if (this.isAndroid()) { 
            jsb.reflection.callStaticMethod(this.ANDROID_API, "setStorageDir", "(Ljava/lang/String;)V",dir);    
        } else if (this.isIOS()) {
            jsb.reflection.callStaticMethod(this.IOS_API, "setStorageDir:",dir);
            if (!jsb.fileUtils.isDirectoryExist(dir)) {
                jsb.fileUtils.createDirectory(dir);
            }
        }
    }

    _playingCount = 0;

    playVoice(content: any, time: number) {
        this._playingCount++;
        let voiceFileName = this.getVoiceFileName();
        this.writeVoice(voiceFileName, content);
        this.play(voiceFileName);
        setTimeout(() => {
            this._playingCount--;
            if (this._playingCount == 0) {
                AudioMgr.ins.resumeAll();
            }
        }, time + 100);
    }

    getVoiceFileName() {
        // return `voicemsg_${Date.now()}.amr`;
        return `voicemsg.amr`;
    }
    
}
