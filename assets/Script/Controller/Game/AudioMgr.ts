const { ccclass, property } = cc._decorator;
import { GameConst } from "../../Const/GameConst";
import { Combine } from "../../Util/Combine";
import AudioModel from "../../Model/Game/AudioModel";
import LocalStorage from "../../Util/LocalStorage";
import LogUtil from "../../Util/LogUtil";

@ccclass
export default class AudioMgr {

    private static _ins: AudioMgr;

    public static get ins() {
        if (!this._ins) {
            this._ins = new AudioMgr();
        }
        return this._ins;
    }

    _musicVolume: number = 1;
    set musicVolume(val: number) {
        LocalStorage.setItem("musicVolume", val);
        cc.audioEngine.setMusicVolume(val);
        this._musicVolume = val;
    }
    get musicVolume() {
        return this._musicVolume;
    }

    _effectVolume: number = 1;
    set effectVolume(val: number) {
        LocalStorage.setItem("effectVolume", val);
        cc.audioEngine.setEffectsVolume(val);
        this._effectVolume = val;
    }
    get effectVolume() {
        return this._effectVolume;
    }

    bgMusicId: number;
   
    // @Combine
    // model: AudioModel = null;

    constructor() {
        this._musicVolume = LocalStorage.getItem("musicVolume") || 1;
        this._effectVolume = LocalStorage.getItem("effectVolume") || 1;
        cc.audioEngine.setMusicVolume(this.musicVolume);
        cc.audioEngine.setEffectsVolume(this.effectVolume);
        // cc.director.on(GameConst.GameSignal.OPEN_BG_MUSIC_CHANGE, this.changeBGMusic, this);
        // cc.director.on(GameConst.GameSignal.OPEN_SOUND_CHANGE, this.changeSound, this);
        // cc.director.on(GameConst.GameSignal.OPEN_SHOCK_CHANGE, this.changeShock, this);
        cc.director.on(GameConst.SystemSignal.SYSTEM_PAUSE, this.pauseAll, this);
        cc.director.on(GameConst.SystemSignal.SYSTEM_RESUME, this.resumeAll, this);
    }

    onDestroy() {
        // cc.director.off(GameConst.GameSignal.OPEN_BG_MUSIC_CHANGE, this.changeBGMusic, this);
        // cc.director.off(GameConst.GameSignal.OPEN_SOUND_CHANGE, this.changeSound, this);
        // cc.director.off(GameConst.GameSignal.OPEN_SHOCK_CHANGE, this.changeShock, this);
        cc.director.off(GameConst.SystemSignal.SYSTEM_PAUSE, this.pauseAll, this);
        cc.director.off(GameConst.SystemSignal.SYSTEM_RESUME, this.resumeAll, this);
    }

    loadAudioClip(path: string, callback: Function) {
        if (!path.endsWith(".mp3")) {
            path += ".mp3";
        }
        try {
            let audioUrl = cc.url.raw(path);
            cc.loader.load(audioUrl, function (err, clip) {
                if (err) {
                    LogUtil.Error("[Audio path unexist] path=", path, ", error=", err);
                } else {
                    callback && callback(err, clip);
                }
            });
        } catch(err) {
            LogUtil.Warn("[Audio path unexist] path=", path);
        }
    }

    playMusic(path: string, loop: boolean = true) {
        if (!path || path.length <= 0) {
            return;
        }
        this.loadAudioClip(path, (err, clip) => {
            cc.audioEngine.playMusic(clip, loop);
        })
    }

    stopMusic() {
        cc.audioEngine.stopMusic();
    }

    playEffect(path: string, loop: boolean = false) {
        if (!path || path.length <= 0) {
            return;
        }
        this.loadAudioClip(path, (err, clip) => {
            cc.audioEngine.playEffect(clip, loop);
        })
    }

    pauseAll(){
        cc.audioEngine.pauseAll();
    }
    
    resumeAll(){
        cc.audioEngine.resumeAll();
    }

    exist(path: string) {
        // @ts-ignore
        return cc.loader._resources._pathToUuid[path] != null;
    }
}