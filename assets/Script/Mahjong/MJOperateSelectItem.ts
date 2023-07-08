import MahjongStraightItem from "./MahjongStraightItem";
import { GameConst } from "../Const/GameConst";
import MJNet from "./MJNet";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MJOperateSelectItem extends cc.Component {

    @property(MahjongStraightItem)
    item_holds: MahjongStraightItem;

    data_chi: number;
    data_gang: number;

    protected start(): void {
        this.item_holds.showType = GameConst.CardShowType.SHOW;
        this.item_holds.sitPos = GameConst.SitPos.DOWN;
        this.item_holds.node.pauseSystemEvents(true);
    }

    updateView(data) {
        if (typeof data == "number") {
            let gangPai = data;
            this.item_holds.updateMahjongs([gangPai, gangPai, gangPai, gangPai]);
            this.data_gang = data;
        } else {
            this.item_holds.updateMahjongs(data.chi);
            this.data_chi = data.index;
        }
    }

    CC_onClickSelect() {
        if (this.data_chi != null) {
            MJNet.C_Chi(this.data_chi);
        } else if (this.data_gang != null) {
            MJNet.C_Gang(this.data_gang);
        }
    }
}