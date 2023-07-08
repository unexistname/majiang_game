import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import MeModel from "../Global/MeModel";
import DXNet from "./DXNet";
import DXOperate from "./DXOperate";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DXOperateView extends cc.Component {

    @property(cc.Node)
    node_eat: cc.Node;
    
    @property(cc.Node)
    node_blindEat: cc.Node;
    
    @property(cc.Node)
    node_touch: cc.Node;
    
    @property(cc.Node)
    node_belt: cc.Node;
    
    @property(cc.Node)
    node_waive: cc.Node;
    
    @property(cc.Node)
    node_reverseBelt: cc.Node;
    
    @property(cc.Node)
    node_noBelt: cc.Node;

    start() {
        NetMgr.addListener(this, NetDefine.WS_Resp.G_TurnBetting, this.G_TurnBetting);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_DoOperate, this.hidden);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_GameSettle, this.hidden);
        this.node.active = false;
    }

    updateView(optionalOperate: number) {
        this.node_eat.active = !!(optionalOperate & DXOperate.EAT);
        this.node_blindEat.active = !!(optionalOperate & DXOperate.BLIND_EAT);
        this.node_touch.active = !!(optionalOperate & DXOperate.TOUCH);
        this.node_belt.active = !!(optionalOperate & DXOperate.BELT);
        this.node_waive.active = !!(optionalOperate & DXOperate.WAIVE);
        this.node_reverseBelt.active = !!(optionalOperate & DXOperate.REVERSE_BELT);
        this.node_noBelt.active = !!(optionalOperate & DXOperate.NO_BELT);
    }

    G_TurnBetting({ turnUserId, optionalOperate, bettingTime }) {
        if (MeModel.isMe(turnUserId)) {
            this.node.active = true;
            this.updateView(optionalOperate);
        } else {
            this.node.active = false;
        }
    }

    hidden() {
        this.node.active = false;
    }

    CC_onClickEat() {
        DXNet.C_Eat();
    }

    CC_onClickBlindEat() {
        DXNet.C_BlindEat();
    }

    CC_onClickShowTouch() {
        DXNet.C_ShowTouch();
    }

    CC_onClickBelt() {
        DXNet.C_Belt();
    }

    CC_onClickWaive() {
        DXNet.C_Waive();
    }

    CC_onClickReverseBelt() {
        DXNet.C_ReverseBelt();
    }

    CC_onClickNoBelt() {
        DXNet.C_NoBelt();
    }

}