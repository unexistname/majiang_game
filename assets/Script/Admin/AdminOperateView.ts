import UIMgr from "../BaseUI/UIMgr";
import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import GameNet from "../Game/GameNet";

const { ccclass } = cc._decorator;

@ccclass
export default class AdminOperateView extends cc.Component {

    protected onLoad(): void {
        NetMgr.addListener(this, NetDefine.WS_Resp.GA_ShowReplaceCard, this.GA_ShowReplaceCard);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_GameOver, this.G_GameOver);
    }

    G_GameOver() {
        UIMgr.closeSelf(this);
    }

    CC_onClickPerspect() {
        GameNet.CA_Perspect();
    }

    CC_onClickShowReplaceCard() {
        GameNet.CA_ShowReplaceCard();
    }

    GA_ShowReplaceCard(data) {
        UIMgr.showView("AdminReplaceCardView", data);
    }
}