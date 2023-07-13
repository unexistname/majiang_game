import { GameConst } from "../Const/GameConst";
import MahjongCombineItem from "../Mahjong/MahjongCombineItem";
import MahjongItem from "../Mahjong/MahjongItem";
import MahjongStraightItem from "../Mahjong/MahjongStraightItem";

const { ccclass, property, menu, executeInEditMode } = cc._decorator;

@ccclass
@menu("麻将组件/MJStraightLayout")
@executeInEditMode
export default class MJStraightLayout extends cc.Layout {

    _spacing: number = 0;

    @property({ type: cc.Integer, tooltip:"子节点的间距" })
    set spacing(val) {
        switch(this.sitPos) {
            case GameConst.SitPos.DOWN:
            case GameConst.SitPos.TOP:
                this.spacingX = val;
                break;
            case GameConst.SitPos.LEFT:
            case GameConst.SitPos.RIGHT:
                this.spacingY = val;
                break;
        }
        this._spacing = val;
    };

    get spacing() {
        return this._spacing;
    }

    _sitPos: GameConst.SitPos = GameConst.SitPos.TOP;

    _reverseSort: boolean = false;

    @property({type: cc.Boolean})
    reverseMode: boolean = false;

    _updateChildSitPos(child, component, val) {
        let item = child.getComponent(component);
        if (item) {
            item.sitPos = val;
        }
    }

    @property({ type:cc.Enum(GameConst.SitPos) })
    set sitPos(val) {
        let oldReversSort = this._reverseSort;
        if (this._getSitPosWidthReverse(val) == GameConst.SitPos.RIGHT) {
            this._reverseSort = true;
        } else {
            this._reverseSort = false;
        }
        if (this._reverseSort != oldReversSort) {
            for (let i = 0, len = this.node.children.length; i < len; ++i) {
                let child = this.node.children[i];
                child.zIndex = len - i;
            }
        }
        for (let child of this.node.children) {
            this._updateChildSitPos(child, MahjongItem, val);
            this._updateChildSitPos(child, MahjongStraightItem, val);
            this._updateChildSitPos(child, MahjongCombineItem, val);
        }

        switch (this._getSitPosWidthReverse(val)) {
            case GameConst.SitPos.DOWN:
                this.type = cc.Layout.Type.HORIZONTAL;
                this.horizontalDirection = cc.Layout.HorizontalDirection.LEFT_TO_RIGHT;
                break;
            case GameConst.SitPos.TOP:
                this.type = cc.Layout.Type.HORIZONTAL;
                this.horizontalDirection = cc.Layout.HorizontalDirection.RIGHT_TO_LEFT;
                break;
            case GameConst.SitPos.LEFT:
            case GameConst.SitPos.RIGHT:
                this.type = cc.Layout.Type.VERTICAL;
                this.verticalDirection = cc.Layout.VerticalDirection.TOP_TO_BOTTOM;
                break;
        }
        this._sitPos = val;
        this._adjustSize();
    };

    _getSitPosWidthReverse(val) {
        if (this.reverseMode) {
            switch (val) {
                case GameConst.SitPos.DOWN:
                    return GameConst.SitPos.RIGHT;
                case GameConst.SitPos.RIGHT:
                    return GameConst.SitPos.TOP;
                case GameConst.SitPos.TOP:
                    return GameConst.SitPos.LEFT;
                case GameConst.SitPos.LEFT:
                    return GameConst.SitPos.DOWN;
            }
        } else {
            return val;
        }
    }

    _adjustSize() {
        switch (this._getSitPosWidthReverse(this._sitPos)) {
            case GameConst.SitPos.LEFT:
            case GameConst.SitPos.RIGHT:
                for (let child of this.node.children) {
                    child.setPosition(new cc.Vec2(0, child.position.y));
                }
                if (this.node.children.length > 0) {
                    this.node.width = this.node.children[0].width;
                    this.node.height = this.node.children[0].height * this.node.children.length;
                }
                break;
            case GameConst.SitPos.DOWN:
            case GameConst.SitPos.TOP:
                for (let child of this.node.children) {
                    child.setPosition(new cc.Vec2(child.position.x, 0));
                }
                if (this.node.children.length > 0) {
                    this.node.width = this.node.children[0].width * this.node.children.length;
                    this.node.height = this.node.children[0].height;
                }
                break;
        }
        if (!this.reverseMode) {
            return;
        }
        this.node.anchorX = this.getSuitAnchorX();
        this.node.anchorY = this.getSuitAnchorY();
        // for (let child of this.node.children) {
        //     child.anchorX = this.getSuitAnchorX();
        //     child.anchorY = this.getSuitAnchorY();
        // }
        let component = this.node.getComponent(cc.Widget);
        component.isAlignLeft = component.isAlignBottom = component.isAlignRight = component.isAlignTop = false;
        switch (this._sitPos) {
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
    }

    _childAdded(child) {
        // @ts-ignore
        super._childAdded(child);
        child.on(cc.Node.EventType.SIZE_CHANGED, this._adjustSize, this);
        child.on('active-in-hierarchy-changed', this._adjustSize, this);

        if (this._reverseSort) {
            let len = this.node.children.length;
            if (len >= 2) {
                let child = this.node.children[len - 1];
                child.zIndex = this.node.children[len - 2].zIndex - 1;
            }
        }
    }

    _childRemoved(child) {
        // @ts-ignore
        super._childRemoved(child);
        child.off(cc.Node.EventType.SIZE_CHANGED, this._adjustSize, this);
        child.off('active-in-hierarchy-changed', this._adjustSize, this);
    }

    protected onEnable(): void {
        super.onEnable();
        this.sitPos = GameConst.SitPos.DOWN;
        this.node.on(cc.Node.EventType.CHILD_ADDED, this._adjustSize, this);
    }

    protected onDisable(): void {
        super.onDisable();
        this.node.off(cc.Node.EventType.CHILD_ADDED, this._adjustSize, this);
    }

    get sitPos() {
        return this._sitPos;
    }

    getSuitAnchorX() {
        switch (this.sitPos) {
            case GameConst.SitPos.DOWN:
            case GameConst.SitPos.LEFT:
                return 0;
            case GameConst.SitPos.TOP:
            case GameConst.SitPos.RIGHT:
                return 1;
        }
    }
    
    getSuitAnchorY() {
        switch (this.sitPos) {
            case GameConst.SitPos.DOWN:
            case GameConst.SitPos.RIGHT:
                return 0;
            case GameConst.SitPos.TOP:
            case GameConst.SitPos.LEFT:
                return 1;
        }
    }

}