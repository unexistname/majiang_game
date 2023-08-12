
import AudioMgr from "../Controller/Game/AudioMgr";
import { GameConst } from "../Const/GameConst";
import DXAudioMgr from "../DiaoXie/DXAudioMgr";
import SGAudioMgr from "../SanGong/SGAudioMgr";
import SSSAudioMgr from "../ShiSanShui/SSSAudioMgr";
import ZJHAudioMgr from "../ZhaJinHua/ZJHAudioMgr";
import DZAudioMgr from "../DeZhou/DZAudioMgr";
import NNAudioMgr from "../NiuNiu/NNAudioMgr";
import MJAudioMgr from "../Game/MJAudioMgr";
import PokerAudioMgr from "../Game/PokerAudioMgr";
import FDAudioMgr from "../FuDing/FDAudioMgr";

export default class AudioTool {

    private static _ins: AudioTool;

    public static get ins() {
        if (!this._ins) {
            this._ins = new AudioTool();
        }
        return this._ins;
    }

    constructor() {
        cc.director.on("choose_banker", this.playRobBankerEffect.bind(this));
        cc.director.on("decide_banker_over", this.playDecideBankerEffect.bind(this));
    }
    
    playLoginBGM() {
        AudioMgr.ins.playMusic(GameConst.AudioPath.COMMON + "bgm0");
    }
    
    playHallBGM() {
        AudioMgr.ins.playMusic(GameConst.AudioPath.COMMON + "bgm1");
    }
    
    playRoomBGM() {
        AudioMgr.ins.playMusic(GameConst.AudioPath.COMMON + "bgm0");
    }
    
    playRobBankerEffect() {
        AudioMgr.ins.playEffect(GameConst.AudioPath.COMMON + "qiang");
    }
    
    playDecideBankerEffect() {
        AudioMgr.ins.playEffect(GameConst.AudioPath.COMMON + "zhuang");
    }
    
    playPropEffect(content) {
        AudioMgr.ins.playEffect(GameConst.AudioPath.PROP + content);
    }

    getAudioMgrByGameName(gameName) {
        switch (gameName) {
            case GameConst.GameType.DIAO_XIE:
                return DXAudioMgr;
            case GameConst.GameType.DE_ZHOU:
                return DZAudioMgr;
            case GameConst.GameType.FU_DING_DA_ZHA:
                return PokerAudioMgr;
            case GameConst.GameType.FU_DING:
                return FDAudioMgr;
            case GameConst.GameType.NIU_NIU:
                return NNAudioMgr;
            case GameConst.GameType.QUE_SHENG:
                return MJAudioMgr;
            case GameConst.GameType.SAN_GONG:
                return SGAudioMgr;
            case GameConst.GameType.SHI_SAN_SHUI:
                return SSSAudioMgr;
            case GameConst.GameType.ZHA_JIN_HUA:
                return ZJHAudioMgr;
            case GameConst.GameType.PAO_DE_KUAI:
                return PokerAudioMgr;
        }
    }
}