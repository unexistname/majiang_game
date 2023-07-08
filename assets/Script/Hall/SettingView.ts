import UIMgr from "../BaseUI/UIMgr";
import AudioMgr from "../Controller/Game/AudioMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SettingView extends cc.Component {

    @property(cc.Slider)
    slider_sound: cc.Slider;
    
    @property(cc.Slider)
    slider_effect: cc.Slider;

    protected start(): void {
        this.slider_sound.progress = AudioMgr.ins.musicVolume;
        this.slider_effect.progress = AudioMgr.ins.effectVolume;
    }

    CC_onSliderSound(event) {
        let percentage = event.progress;
        AudioMgr.ins.effectVolume = percentage;
    }

    CC_onSliderMusic(event) {
        let percentage = event.progress;
        AudioMgr.ins.musicVolume = percentage;
    }

    CC_onClickClose() {
        UIMgr.closeSelf(this);
    }
}