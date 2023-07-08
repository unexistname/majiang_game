const { ccclass, property } = cc._decorator;
import { GameConst } from "../../Const/GameConst";
import { Singleton } from "../../Util/Singleton";
import LocalStorage from "../../Util/LocalStorage";

class AudioCacheData {
    // 背景音乐
    openBGMusic: boolean = true;
    // 音效
    openSound: boolean = true;
    // 打开震动
    openShock: boolean = false;

    constructor() {
        this.openBGMusic = LocalStorage.getItem("open_bg_music", true);
        this.openSound = LocalStorage.getItem("open_sound", true);
        this.openShock = LocalStorage.getItem("open_shock", false);
    }
}

@ccclass
@Singleton
export default class AudioModel {

    cache: AudioCacheData = null;

    onLoad() {
        if (this.cache == null) {
            this.cache = new AudioCacheData();
        }
    }

    isOpenBGMusic() {
        return this.cache.openBGMusic;
    }

    isOpenSound() {
        return this.cache.openSound;
    }

    isOpenShock() {
        return this.cache.openShock;
    }

    updateOpenBGMusic(value: boolean) {
        if (this.cache.openBGMusic != value) {
            LocalStorage.setItem("open_bg_music", value);
            this.cache.openBGMusic = value;
            cc.director.emit(GameConst.GameSignal.OPEN_BG_MUSIC_CHANGE, value);
        }
    }

    updateOpenSound(value: boolean) {
        if (this.cache.openSound != value) {
            LocalStorage.setItem("open_sound", value);
            this.cache.openSound = value;
            cc.director.emit(GameConst.GameSignal.OPEN_SOUND_CHANGE, value);
        }
    }

    updateOpenShock(value: boolean) {
        if (this.cache.openBGMusic != value) {
            LocalStorage.setItem("open_shock", value);
            this.cache.openShock = value;
            cc.director.emit(GameConst.GameSignal.OPEN_SHOCK_CHANGE, value);
        }
    }
}