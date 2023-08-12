import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import GameMgr from "./GameMgr";
import GameNet from "./GameNet";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PlayCardSortOperateView extends cc.Component {

    protected onLoad(): void {
        NetMgr.addListener(this, NetDefine.WS_Resp.G_BeginGame, this.G_BeginGame);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_GameSettle, this.G_GameSettle);
        this.node.active = GameMgr.ins.isBettingState();
    }

    G_BeginGame() {
        this.node.active = true;
    }

    G_GameSettle() {
        this.node.active = false;
    }

    CC_onClickSortCard(event) {
        GameNet.C_SortCard();
    }

    CC_onClickRestoreCard(event) {
        GameNet.C_RestoreCard();
    }

    CC_onClickArrangeCard(event) {
        GameNet.C_ArrangeCard(GameMgr.ins.getSelectCards());
    }
}