import { GameConst } from "../Const/GameConst";
import MahjongCombineItem from "../Mahjong/MahjongCombineItem";
import MahjongItem from "../Mahjong/MahjongItem";
import MahjongStraightItem from "../Mahjong/MahjongStraightItem";

const { ccclass, property, menu, executeInEditMode, requireComponent } = cc._decorator;

@ccclass
@menu("麻将组件/MJGridLayout")
@requireComponent(cc.Widget)
@requireComponent(cc.Layout)
@executeInEditMode
export default class MJGridLayout extends cc.Component {
    

    _mahjongNumOneLine: number = 10;
    
    @property({type: cc.Integer})
    set mahjongNumOneLine(val) {
        this._mahjongNumOneLine = val;
        this._adjustSize();
    }

    get mahjongNumOneLine() {
        return this._mahjongNumOneLine;
    }

    private _sitPos: GameConst.SitPos = GameConst.SitPos.TOP;

    private _reverseSort: boolean = false;

    private _updateChildSitPos(child, component, val) {
        let item = child.getComponent(component);
        if (item) {
            item.sitPos = val;
        }
    }

    @property({ type:cc.Enum(GameConst.SitPos) })
    set sitPos(val) {
        for (let child of this.node.children) {
            this._updateChildSitPos(child, MahjongItem, val);
            this._updateChildSitPos(child, MahjongStraightItem, val);
            this._updateChildSitPos(child, MahjongCombineItem, val);
        }
        this._sitPos = val;
        let layout = this.node.getComponent(cc.Layout);
        layout.type = cc.Layout.Type.GRID;
        switch (val) {
            case GameConst.SitPos.DOWN:
                layout.verticalDirection = cc.Layout.VerticalDirection.BOTTOM_TO_TOP;
                layout.horizontalDirection = cc.Layout.HorizontalDirection.LEFT_TO_RIGHT;
                layout.startAxis = cc.Layout.AxisDirection.HORIZONTAL;
                break;
            case GameConst.SitPos.TOP:
                layout.verticalDirection = cc.Layout.VerticalDirection.TOP_TO_BOTTOM;
                layout.horizontalDirection = cc.Layout.HorizontalDirection.RIGHT_TO_LEFT;
                layout.startAxis = cc.Layout.AxisDirection.HORIZONTAL;
                break;
            case GameConst.SitPos.LEFT:
                layout.verticalDirection = cc.Layout.VerticalDirection.TOP_TO_BOTTOM;
                layout.horizontalDirection = cc.Layout.HorizontalDirection.LEFT_TO_RIGHT;
                layout.startAxis = cc.Layout.AxisDirection.VERTICAL;
                break;
            case GameConst.SitPos.RIGHT:
                layout.verticalDirection = cc.Layout.VerticalDirection.BOTTOM_TO_TOP;
                layout.horizontalDirection = cc.Layout.HorizontalDirection.RIGHT_TO_LEFT;
                layout.startAxis = cc.Layout.AxisDirection.VERTICAL;
                break;
        }
        this.node.anchorX = this.getSuitAnchorX();
        this.node.anchorY = this.getSuitAnchorY();
        let component = this.node.getComponent(cc.Widget);
        component.isAlignLeft = component.isAlignBottom = component.isAlignRight = component.isAlignTop = false;
        switch (val) {
            case GameConst.SitPos.DOWN:
                component.isAlignLeft = component.isAlignBottom = true;
                component.left = component.bottom = 0;
                break;
            case GameConst.SitPos.TOP:
                component.isAlignRight = component.isAlignTop = true;
                component.right = component.top = 0;
                break;
            case GameConst.SitPos.LEFT:
                component.isAlignLeft = component.isAlignTop = true;
                component.left = component.top = 0;
                break;
            case GameConst.SitPos.RIGHT:
                component.isAlignRight = component.isAlignBottom = true;
                component.right = component.bottom = 0;
                break;
        }

        let oldReversSort = this._reverseSort;
        if (val == GameConst.SitPos.DOWN || val == GameConst.SitPos.RIGHT) {
            this._reverseSort = true;
        } else {
            this._reverseSort = false;
        }
        this._adjustSize();
        // this._adjustSize(this._reverseSort != oldReversSort);
    }

    _updateLayout(needReverse?: boolean) {
        for (let i = 0, len = this.node.children.length; i < len; ++i) {
            let child = this.node.children[i];
            child.zIndex = 0;
        }

        this.scheduleOnce(() => {
            // @ts-ignore
            this.node.getComponent(cc.Layout)._doLayout();
            this.node.getComponent(cc.Layout).enabled = false;
            this._adjustOrder();
        }, 0);
    }

    _adjustSize(needReverse?: boolean) {
        switch (this._sitPos) {
            case GameConst.SitPos.DOWN:
            case GameConst.SitPos.TOP:
                if (this.node.children.length > 0) {
                    this.node.width = this.node.children[0].width * this._mahjongNumOneLine * this.node.children[0].scale;
                    // this.node.height = this.node.children[0].height * Math.ceil(this.node.children.length / this.mahjongNumOneLine);
                }
                break;
            case GameConst.SitPos.LEFT:
            case GameConst.SitPos.RIGHT:
                if (this.node.children.length > 0) {
                    // this.node.width = this.node.children[0].width * Math.ceil(this.node.children.length / this.mahjongNumOneLine);
                    this.node.height = this.node.children[0].height * this._mahjongNumOneLine * this.node.children[0].scale;
                }
                break;
        }
        this._updateLayout(needReverse);
    }

    _adjustOrder(needReverse?: boolean) {
        if (needReverse != null) {
            if (!needReverse) {
                return;
            }
        } else if (!this._reverseSort) {
            return;
        }
        for (let i = 0, len = this.node.children.length; i < len; ++i) {
            let child = this.node.children[i];
            child.zIndex = len - i;
        }
    }

    protected onEnable(): void {
        this.sitPos = GameConst.SitPos.DOWN;
        this.node.on(cc.Node.EventType.CHILD_ADDED, this._adjustSize, this);
        this.node.on(cc.Node.EventType.CHILD_REMOVED, this._updateLayout, this);
        this.node.on(cc.Node.EventType.SIZE_CHANGED, this._updateLayout, this);
        let layout = this.node.getComponent(cc.Layout);
        layout.type = cc.Layout.Type.GRID;
        layout.resizeMode = cc.Layout.ResizeMode.CONTAINER;
        layout.enabled = false;
    }

    protected onDisable(): void {
        this.node.off(cc.Node.EventType.CHILD_ADDED, this._adjustSize, this);
        this.node.off(cc.Node.EventType.CHILD_REMOVED, this._updateLayout, this);
        this.node.off(cc.Node.EventType.SIZE_CHANGED, this._updateLayout, this);
    }

    get sitPos() {
        return this._sitPos;
    }

    getSuitAnchorX() {
        switch (this._sitPos) {
            case GameConst.SitPos.DOWN:
                return 0.5;
            case GameConst.SitPos.LEFT:
                return 0;
            case GameConst.SitPos.TOP:
                return 0.5;
            case GameConst.SitPos.RIGHT:
                return 1;
        }
    }
    
    getSuitAnchorY() {
        switch (this._sitPos) {
            case GameConst.SitPos.DOWN:
                return 1;
            case GameConst.SitPos.RIGHT:
                return 0.5;
            case GameConst.SitPos.TOP:
                return 0;
            case GameConst.SitPos.LEFT:
                return 0.5;
        }
    }

}