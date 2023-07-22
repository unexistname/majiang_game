import UIMgr from "../BaseUI/UIMgr";
import { GameConst } from "../Const/GameConst";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("麻将组件/MahjongUnitItem")
export default class MahjongUnitItem extends cc.Component {

    sitPos: GameConst.SitPos;

    @property(cc.Node)
    node_select: cc.Node;

    @property(cc.Sprite)
    sp_mahjong_show: cc.Sprite;

    @property(cc.Sprite)
    sp_mahjong_stand: cc.Sprite;

    @property(cc.Node)
    node_hun: cc.Node;

    setSitPos(sitPos) {
        this.sitPos = sitPos;
    }

    showSelect(isSelect) {
        if (this.node_select) {
            this.node_select.active = isSelect;
        }
    }

    showHun(isHun) {
        // if (this.node_hun) {
            this.node_hun.active = isHun;
        // }
    }

    updateView({mahjongId, showType}) {
        if (showType == GameConst.CardShowType.STAND) {
            UIMgr.setMahjong(this.sp_mahjong_stand, mahjongId, showType, this.sitPos);
            this.sp_mahjong_stand.node.active = true;
            this.sp_mahjong_show.node.active = false;
        } else {
            UIMgr.setMahjong(this.sp_mahjong_show, mahjongId, showType, this.sitPos);
            this.sp_mahjong_stand.node.active = false;
            this.sp_mahjong_show.node.active = true;
        }
    }

}