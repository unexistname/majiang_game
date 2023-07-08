import UIMgr from "../BaseUI/UIMgr";
import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import RoomNet from "../Room/RoomNet";
import GameUtil from "../Util/GameUtil";
import GameOverItem from "./GameOverItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameOverView extends cc.Component {

    @property(cc.Label)
    txt_owner: cc.Label;
    
    @property(cc.Label)
    txt_round: cc.Label;
    
    @property(cc.Label)
    txt_endTime: cc.Label;

    @property(cc.Node)
    node_settles: cc.Node;

    @property(cc.Prefab)
    prefab_item: cc.Prefab;

    protected start(): void {
        NetMgr.addListener(this, NetDefine.WS_Resp.G_GameOver, this.G_GameOver);
        this.node.active = false;
    }

    G_GameOver(data) {
        this.txt_owner.string = data.ownerName;
        this.txt_round.string = data.totalRounds;
        this.txt_endTime.string = GameUtil.getStandDate(data.endTime);
        GameUtil.clearChildren(this.node_settles);
        for (let userId in data.records) {
            let record = data.records[userId];
            UIMgr.createNode(this.prefab_item, this.node_settles, GameOverItem, record);
        }
        this.node.active = true;
    }

    updateView() {

    }

    hidden() {
        this.node.active = false;
    }

    CC_onClickExit() {
        RoomNet.C_LeaveRoom();
        this.hidden();
    }

    CC_onClickContinue() {
        RoomNet.C_ContinueGame();
        this.hidden();
    }
}