import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import GamberItem from "../Gamber/GamberItem";
import PokerDoOperateItem from "../Game/PokerDoOperateItem";
import ZJHNet from "./ZJHNet";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ZJHGamberItem extends cc.Component {
    
    @property(GamberItem)
    item_gamber: GamberItem;

    @property(PokerDoOperateItem)
    item_betting: PokerDoOperateItem;

    userId: string;

    @property(cc.Node)
    sp_eliminate: cc.Node;

    @property(cc.Node)
    node_compareSelect: cc.Node;

    protected start(): void {
        this.sp_eliminate.active = false;
        this.node_compareSelect.active = false;
        NetMgr.addListener(this, NetDefine.WS_Resp.G_GameSettle, this.G_GameSettle);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_Eliminate, this.G_Eliminate);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_CompareSelect, this.G_CompareSelect);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_DoOperate, this.G_DoOperate);
    }

    updateView(data) {
        this.userId = data.userId;
        this.item_gamber.updateView(data);
        if (this.item_betting) {
            this.item_betting.updateView(data.userId);
        }
    }

    G_DoOperate(data) {
        // if (data.operate == ZJHOperate.COMPARE) {
            this.node_compareSelect.active = false;
        // }
    }

    G_CompareSelect(data) {
        if (data.cmpUserIds.indexOf(this.userId) >= 0) {
            this.node_compareSelect.active = true;
        }
    }

    G_TurnBetting(data) {
        this.node_compareSelect.active = false;
    }

    G_Eliminate(data) {
        if (data.userId == this.userId) {
            this.sp_eliminate.active = true;
        }
    }

    G_GameSettle(data) {
        this.sp_eliminate.active = false;
    }

    CC_onSelectGamber() {
        ZJHNet.C_Compare(this.userId);
    }
}