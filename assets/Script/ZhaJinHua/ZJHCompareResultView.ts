import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import RoomMgr from "../Room/RoomMgr";
import ZJHGamberItem from "./ZJHGamberItem";
import ZJHOperate from "./ZJHOperate";


const { ccclass, property } = cc._decorator;

@ccclass
export default class ZJHCompareResultView extends cc.Component {

    @property(ZJHGamberItem)
    gamberLeft: ZJHGamberItem;

    @property(ZJHGamberItem)
    gamberRight: ZJHGamberItem;

    protected start(): void {
        this.node.active = false;
        NetMgr.addListener(this, NetDefine.WS_Resp.G_DoOperate, this.G_DoOperate);
    }

    G_DoOperate(data) {
        if (data.operate == ZJHOperate.COMPARE) {
            if (data.isSync) {
                return;
            }
            this.updateView(data.value);
        }
    }

    showAnim(component, offsetX, isLose) {
        let node = component.node;
        let position = node.getPosition();
        node.setPosition(new cc.Vec2(position.x + offsetX, position.y));

        let action = cc.sequence(
            cc.moveTo(0.3, position),
            cc.callFunc(() => {
                if (isLose) {
                    component.sp_eliminate.active = true;
                }
            }),
            cc.delayTime(0.5),
            cc.callFunc(() => {
                this.node.active = false;
            })
        );
        node.stopAllActions();
        node.runAction(action);
    }

    updateView(data) {
        let gamber = RoomMgr.ins.getGamber(data.userId);
        
        let cmpGamber = RoomMgr.ins.getGamber(data.cmpUserId);
        
        this.gamberLeft.updateView(gamber);
        this.gamberRight.updateView(cmpGamber);
        this.node.active = true;
        console.log("zzzzzzzzzzz", this.node.active);
        // setTimeout(() => {
        //     this.node.active = false
        // }, 800);
        this.showAnim(this.gamberLeft, -100, !data.result);
        this.showAnim(this.gamberRight, 100, data.result);
    }
}