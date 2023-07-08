import { GameConst } from "../Const/GameConst";
import MahjongCombineItem from "../Mahjong/MahjongCombineItem";
import MahjongItem from "../Mahjong/MahjongItem";
import MahjongStraightItem from "../Mahjong/MahjongStraightItem";

const { ccclass, property, menu, executeInEditMode } = cc._decorator;

@ccclass
@menu("麻将组件/MJGridLayout")
@executeInEditMode
export default class MJGridLayout extends cc.Layout {

    // @property({type: cc.Integer})
    // mahjongNumOneLine: number = 10;

    _sitPos: GameConst.SitPos = GameConst.SitPos.TOP;

    _reverseSort: boolean = false;

    _updateChildSitPos(child, component, val) {
        let item = child.getComponent(component);
        if (item) {
            item.sitPos = val;
        }
    }

    @property({ type:cc.Enum(GameConst.SitPos) })
    set sitPos(val) {
        let oldReversSort = this._reverseSort;
        if (val == GameConst.SitPos.RIGHT || val == GameConst.SitPos.DOWN) {
            this._reverseSort = true;
        } else {
            this._reverseSort = false;
        }
        if (this._reverseSort != oldReversSort) {
            for (let i = 0, len = this.node.children.length; i < len; ++i) {
                let child = this.node.children[i];
                // child.setSiblingIndex(len-i)
                child.zIndex = len - i;
            }
        }
        for (let child of this.node.children) {
            this._updateChildSitPos(child, MahjongItem, val);
            this._updateChildSitPos(child, MahjongStraightItem, val);
            this._updateChildSitPos(child, MahjongCombineItem, val);
        }

        switch (val) {
            case GameConst.SitPos.DOWN:
                // if (this.node.children.length > 0) {
                //     this.node.width = this.node.children[0].width * this.mahjongNumOneLine;
                // }
                this.horizontalDirection = cc.Layout.HorizontalDirection.LEFT_TO_RIGHT;
                this.verticalDirection = cc.Layout.VerticalDirection.TOP_TO_BOTTOM;
                this.startAxis = cc.Layout.AxisDirection.HORIZONTAL;
                break;
            case GameConst.SitPos.TOP:
                // if (this.node.children.length > 0) {
                //     this.node.width = this.node.children[0].width * this.mahjongNumOneLine;
                // }
                this.horizontalDirection = cc.Layout.HorizontalDirection.RIGHT_TO_LEFT;
                this.verticalDirection = cc.Layout.VerticalDirection.TOP_TO_BOTTOM;
                this.startAxis = cc.Layout.AxisDirection.HORIZONTAL;
                break;
            case GameConst.SitPos.LEFT:
                // if (this.node.children.length > 0) {
                //     this.node.height = this.node.children[0].height * this.mahjongNumOneLine;
                // }
                this.horizontalDirection = cc.Layout.HorizontalDirection.LEFT_TO_RIGHT;
                this.verticalDirection = cc.Layout.VerticalDirection.TOP_TO_BOTTOM;
                this.startAxis = cc.Layout.AxisDirection.VERTICAL;
                break;
            case GameConst.SitPos.RIGHT:
                // if (this.node.children.length > 0) {
                //     this.node.height = this.node.children[0].height * this.mahjongNumOneLine;
                // }
                this.horizontalDirection = cc.Layout.HorizontalDirection.RIGHT_TO_LEFT;
                this.verticalDirection = cc.Layout.VerticalDirection.TOP_TO_BOTTOM;
                this.startAxis = cc.Layout.AxisDirection.VERTICAL;
                break;
        }
        this._sitPos = val;
    };

    protected onEnable(): void {
        super.onEnable();
        this.sitPos = GameConst.SitPos.DOWN;
        // this.node.on(cc.Node.EventType.CHILD_ADDED, this._resizeContent, this);
    }

    // _resizeContent() {
    //     if (this.node.children.length == 1) {
    //         switch (this.sitPos) {
    //             case GameConst.SitPos.DOWN:
    //             case GameConst.SitPos.TOP:
    //                 this.node.width = this.node.children[0].width * this.mahjongNumOneLine;
    //                 break;
    //             case GameConst.SitPos.LEFT:
    //             case GameConst.SitPos.RIGHT:
    //                 this.node.height = this.node.children[0].height * this.mahjongNumOneLine;
    //                 break;
    //         }
    //     }
    // }

    protected onDisable(): void {
        super.onDisable();
        // this.node.off(cc.Node.EventType.CHILD_ADDED, this._resizeContent, this);
    }

    get sitPos() {
        return this._sitPos;
    }

}