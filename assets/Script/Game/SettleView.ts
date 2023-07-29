import UIMgr from "../BaseUI/UIMgr";
import MeModel from "../Global/MeModel";
import RoomMgr from "../Room/RoomMgr";
import RoomNet from "../Room/RoomNet";
import { GameConst } from "../Const/GameConst";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SettleView extends cc.Component {

    @property(cc.Node)
    node_win: cc.Node;

    @property(cc.Node)
    node_lose: cc.Node;

    @property(cc.Node)
    node_stop: cc.Node;

    @property(cc.Node)
    node_settleItems: cc.Node;

    updateView(data) {
        this.node_stop.active = data.forceOver;
        let isWin = data.settles[MeModel.userId] && data.settles[MeModel.userId].isWin;
        this.node_win.active = !data.forceOver && isWin;
        this.node_lose.active = !data.forceOver && !isWin;
        let gameType = RoomMgr.ins.getGameType();
        let settleItemName = this.getSettleItemName(gameType);
        for (let userId in data.settles) {
            let settleData = data.settles[userId];
            UIMgr.createPrefab(settleItemName, this.node_settleItems, settleData);
        }
    }

    CC_onClickContinue() {
        RoomNet.C_OverSettle();
        UIMgr.closeSelf(this);
    }

    CC_onClickClose() {
        this.CC_onClickContinue();
    }

    getSettleItemName(gameType) {
        switch (gameType) {
            case GameConst.GameType.DIAO_XIE:
                return "DXSettleItem";
            case GameConst.GameType.DE_ZHOU:
                return "DZSettleItem";
            case GameConst.GameType.FU_DING_DA_ZHA:
                return "FDDZSettleItem";
            case GameConst.GameType.FU_DING:
                return "FDSettleItem";
            case GameConst.GameType.NIU_NIU:
                return "NNSettleItem";
            case GameConst.GameType.QUE_SHENG:
                return "QSSettleItem";
            // case GameConst.GameType.SAN_GONG:
            //     return "SGSettleItem";
            case GameConst.GameType.SHI_SAN_SHUI:
                return "SSSSettleItem";
            // case GameConst.GameType.ZHA_JIN_HUA:
            //     return "ZJHSettleItem";
            // case GameConst.GameType.PAO_DE_KUAI:
            //     return "PDKSettleItem";
            default:
                return "SettleItem";
        }
    }
}
