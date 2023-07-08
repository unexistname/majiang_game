import UIMgr from "../../BaseUI/UIMgr";
import GameUtil from "../../Util/GameUtil";
import HallNet from "../HallNet";
import CommonConfItem from "./CommonConfItem";
import RuleConfItem from "./RuleConfItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CreateRoomView extends cc.Component {

    @property(cc.Node)
    node_gameTypes: cc.Node;

    @property(cc.Node)
    node_gameConfs: cc.Node;

    @property(cc.Node)
    prefab_gameType: cc.Node;

    @property(cc.Node)
    prefab_commonConf: cc.Node;

    @property(cc.Node)
    prefab_ruleConf: cc.Node;

    @property(cc.Sprite)
    sp_costType: cc.Sprite;

    @property(cc.Label)
    txt_costType: cc.Label;

    roomConfs: any[];

    confItems: any[];

    confIndex: number;

    updateView(roomConfs: any[]) {
        GameUtil.clearChildren(this.node_gameTypes);
        this.roomConfs = roomConfs;
        for (let i = 0; i < roomConfs.length; ++i) {
        // for (let roomConf of roomConfs) {
            let roomConf = roomConfs[i];
            let gameTypeNode = UIMgr.createNode(this.prefab_gameType, this.node_gameTypes);
            // @ts-ignore
            gameTypeNode.confIndex = i;
            let gameNameLabel = gameTypeNode.getChildByName("txt_gameName").getComponent(cc.Label);
            gameNameLabel.string = roomConf.gameName;
        }
        this.selectGameType(0);
    }

    selectGameType(index: number) {
        let roomConf = this.roomConfs[index];
        let costType = roomConf.costType;
        let costNum = roomConf.costNum;
        if (costType != null && costNum) {
            UIMgr.setCost(this.sp_costType, costType);
            this.txt_costType.string = "X" + costNum + "/人/局";
            this.sp_costType.node.parent.active = true;
        } else {
            this.sp_costType.node.parent.active = false;
        }
        this.confItems = [];
        GameUtil.clearChildren(this.node_gameConfs);
        for (let commonConf of roomConf.commonConfs) {
            let commonConfNode = UIMgr.createNode(this.prefab_commonConf, this.node_gameConfs, CommonConfItem, commonConf);
            this.confItems.push(commonConfNode.getComponent(CommonConfItem));
        }
        if (roomConf.ruleConfs.length > 0) {
            let ruleConfNode = UIMgr.createNode(this.prefab_ruleConf, this.node_gameConfs, RuleConfItem, roomConf.ruleConfs);
            this.confItems.push(ruleConfNode.getComponent(RuleConfItem));
        }
        this.confIndex = index;
    }

    CC_onClickGameType(event) {
        this.selectGameType(event.target.confIndex);
    }

    CC_onClickCreateRoom() {
        let confs = [];
        for (let confItem of this.confItems) {
            confs = confs.concat(confItem.getSelectData());
        }
        let roomConf = this.roomConfs[this.confIndex];
        HallNet.C_CreateRoom(roomConf.gameName, confs);
    }

    CC_onClickClose() {
        UIMgr.closeSelf(this);
    }
}