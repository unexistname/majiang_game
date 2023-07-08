import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import GamberItem from "../Gamber/GamberItem";
import PokerBettingItem from "./PokerBettingItem";
import PokerRobItem from "./PokerRobItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RobGamberItem extends cc.Component {
    
    @property(GamberItem)
    item_gamber: GamberItem;

    @property(PokerBettingItem)
    item_betting: PokerBettingItem;

    @property(PokerRobItem)
    item_rob: PokerRobItem;

    userId: string;

    protected start(): void {
        NetMgr.addListener(this, NetDefine.WS_Resp.G_GameSettle, this.G_GameSettle);
    }

    G_GameSettle() {
        this.item_gamber.chooseBanker(false);
        this.item_gamber.decideBanker(false);
    }

    updateView(data) {
        this.userId = data.userId;
        this.item_gamber.updateView(data);
        this.item_betting.updateView(data.userId);
        this.item_rob.updateView(data.userId);
    }
}