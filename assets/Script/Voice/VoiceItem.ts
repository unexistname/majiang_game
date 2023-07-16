import UIMgr from "../BaseUI/UIMgr";
import { GameConst } from "../Const/GameConst";
import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import RoomNet from "../Room/RoomNet";
import VoiceMgr from "./VoiceMgr";


const { ccclass, property } = cc._decorator;

@ccclass
export default class VoiceItem extends cc.Component {

    @property(cc.Node)
    node_voice: cc.Node;

    lastTouchTime: number;

    voiceFileName: string = "record.amr";

    protected start(): void {
        NetMgr.addListener(this, NetDefine.WS_Resp.G_Voice, this.G_Voice);
        
        this.node_voice.on(cc.Node.EventType.TOUCH_START, this.onTouchDown, this);
        this.node_voice.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node_voice.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node_voice.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    G_Voice(data) {
        VoiceMgr.ins.playVoice(data.content, data.time);
    }

    onTouchDown(event) {
        VoiceMgr.ins.prepare(this.voiceFileName);
        this.lastTouchTime = Date.now();
        UIMgr.showView("VoiceSpeakView", this.lastTouchTime);
    }

    onTouchMove(event) {

    }

    onTouchEnd(event) {
        if(Date.now() - this.lastTouchTime < 1000){
            UIMgr.showAlert("语音时间小于1秒，不能发送");
            this.onTouchCancel(null);
        } else {
            this.onVoiceOK();
        }
    }

    onTouchCancel(event) {
        VoiceMgr.ins.cancel();
        this.lastTouchTime = null;
        UIMgr.closeView("VoiceSpeakView");
    }
    
    onVoiceOK() {
        if (this.lastTouchTime != null) {
            VoiceMgr.ins.release();
            let time = Date.now() - this.lastTouchTime;
            let msg = VoiceMgr.ins.getVoiceData(this.voiceFileName);
            RoomNet.C_Voice(msg, time);
        }
        this.lastTouchTime = null;
        UIMgr.closeView("VoiceSpeakView");
    }

    update(dt) {        
        if(this.lastTouchTime){
            let time = Date.now() - this.lastTouchTime;
            if (time >= GameConst.Config.VOICE_MAX_TIME) {
                this.onVoiceOK();
            }
        }
    }
    
}