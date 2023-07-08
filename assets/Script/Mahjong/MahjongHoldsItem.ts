import UIMgr from "../BaseUI/UIMgr";
import { GameConst } from "../Const/GameConst";
import MJStraightLayout from "../Util/MJStraightLayout";
import MahjongCombineItem from "./MahjongCombineItem";
import CardEventHandle from "./CardEventHandle";
import MahjongItem from "./MahjongItem";
import MahjongStraightItem from "./MahjongStraightItem";

const { ccclass, property, menu, executeInEditMode } = cc._decorator;


@ccclass("CombineData")
export class CombineData {
    @property([cc.Integer])
    combine: number[] = []
}

@ccclass
@menu("麻将组件/MahjongHoldsItem")
@executeInEditMode
export default class MahjongHoldsItem extends CardEventHandle {

    _sitPos: GameConst.SitPos = GameConst.SitPos.DOWN;

    get sitPos() {
        return this._sitPos;
    }

    @property({ type: GameConst.SitPos })
    set sitPos(val) {
        this.setSitPos(val);
    }

    setSitPos(sitPos) {
        this._sitPos = sitPos;
        for(let combineItem of this.node_combines.children) {
            combineItem.getComponent(MahjongCombineItem).sitPos = sitPos;
        }
        this.node_holds.sitPos = sitPos;
        this.item_drawCard.sitPos = sitPos;
        this.getComponent(MJStraightLayout).sitPos = sitPos;
    }

    _showType: GameConst.CardShowType = GameConst.CardShowType.STAND;

    get showType() {
        return this._showType;
    }

    @property({ type: GameConst.CardShowType })
    set showType(val) {
        this._showType = val;
        this.node_holds.showType = val;
        this.item_drawCard.showType = val;
    }

    _combines: CombineData[] = [];

    @property({type: [CombineData]})
    set combines(val) {
        this.updateCombines(val);
    }

    get combines() {
        return this._combines;
    }

    _holds: number[] = [];

    get holds() {
        return this._holds;
    }

    @property({type: [cc.Integer]})
    set holds(val) {
        this.updateHolds(val);
    }

    _drawMahjong: number = 0;

    get drawMahjong() {
        return this._drawMahjong;
    }

    @property({type: cc.Integer})
    set drawMahjong(val) {
        this.updateDrawCard(val);
    }

    @property(cc.Node)
    node_combines: cc.Node;

    @property(MahjongStraightItem)
    node_holds: MahjongStraightItem;

    @property(MahjongItem)
    item_drawCard: MahjongItem;

    updateCombines(combines) {
        let combineItems = this.node_combines.children;
        for (let i = 0; i < combines.length; ++i) {
            let data = combines[i].combine;
            if (!combineItems[i]) {
                this.createCombineItem(i, data);
            } else {
                combineItems[i].getComponent(MahjongCombineItem).updateView(data);
                combineItems[i].active = true;
            }
        }
        for (let i = combines.length; i < combineItems.length; ++i) {
            combineItems[i].active = false;
        }
        this._combines = combines;
        this.node_combines.active = this._combines.length > 0;
    }

    updateHolds(holds) {
        this._holds = holds;
        this.node_holds.sitPos = this.sitPos;
        this.node_holds.showType = this.showType;
        this.node_holds.updateMahjongs(holds);
    }

    hideDrawMahjong() {
        this.item_drawCard.setHidden(true);
    }

    updateDrawCard(card) {
        this.item_drawCard.setHidden(false);
        this.item_drawCard.setMahjong(card);
        this._drawMahjong = card;
    }

    createCombineItem(index, data) {
        UIMgr.createPrefab("MahjongCombineItem", this.node_combines, null, (err, node) => {
            let item = node.getComponent(MahjongCombineItem);
            item.setSitPos(this.sitPos);
            item.updateView(data);
        });
    }
}