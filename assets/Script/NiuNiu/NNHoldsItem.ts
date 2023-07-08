import UIMgr from "../BaseUI/UIMgr";
import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import BaseHoldsItem from "../Game/BaseHoldsItem";
import ResUtil from "../Util/ResUtil";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NNHoldsItem extends BaseHoldsItem {

    @property(cc.Sprite)
    sp_niu: cc.Sprite;

    protected start(): void {
        super.start();
        this.sp_niu.node.active = false;
    }

    G_ShowCard(data) {
        if (data[this.userId]) {
            this.updateHolds(data[this.userId].holds);
            this.sp_niu.node.active = true;
            let cardType = data[this.userId].cardType;
            let path = ResUtil.getNiuNiuCardTypeImagePath(cardType);
            UIMgr.setSprite(this.sp_niu, path, (err, spriteFrame) => {
                if (err) {
                    this.sp_niu.node.active = false;
                }
            });
        }
    }
}