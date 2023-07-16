import UIMgr from "../BaseUI/UIMgr";
import { GameConst } from "../Const/GameConst";
import VoiceMgr from "./VoiceMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VoiceSpeakView extends cc.Component {

    @property(cc.Node)
    node_volumes: cc.Node;

    @property(cc.Node)
    node_time: cc.Node;

    startTime: number;

    lastCheckTime: number = -1;

    protected start(): void {
        cc.director.on(GameConst.SystemSignal.SYSTEM_PAUSE, this.onClose, this);
    }

    protected onDestroy(): void {
        cc.director.off(GameConst.SystemSignal.SYSTEM_PAUSE, this.onClose, this);
    }

    onClose() {
        UIMgr.closeSelf(this);
    }

    updateView(startTime) {
        this.startTime = startTime;
    }

    update(dt) {
        if(Date.now() - this.lastCheckTime > 300){
            let v = VoiceMgr.ins.getVoiceLevel(7);
            let volumeNodes = this.node_volumes.children;
            for(let i = 0; i < volumeNodes.length; ++i){
                volumeNodes[i].active = i == v - 1;
            }
            this.lastCheckTime = Date.now();
        }
        if (this.startTime != null) {
            let time = Date.now() - this.startTime;
            let percent = time / GameConst.Config.VOICE_MAX_TIME;
            this.node_time.scaleX = 1 - percent;
        }
    }
}