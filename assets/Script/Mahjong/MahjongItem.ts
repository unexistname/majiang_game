import UIMgr from "../BaseUI/UIMgr";
import { GameConst } from "../Const/GameConst";
import GameMgr from "../Game/GameMgr";
import GameUtil from "../Util/GameUtil";
import CardEventHandle from "./CardEventHandle";
import MahjongUnitItem from "./MahjongUnitItem";

const { ccclass, property, menu, executeInEditMode } = cc._decorator;

@ccclass
@menu("麻将组件/MahjongItem")
@executeInEditMode
export default class MahjongItem extends CardEventHandle {

    _end: boolean = true;

    _sitPos: GameConst.SitPos = GameConst.SitPos.DOWN;

    _showType: GameConst.CardShowType = GameConst.CardShowType.STAND;

    _mahjongId: number = CC_EDITOR ? -1 : null;

    _loadingMahjongId?: number;

    @property({ type:cc.Integer })
    set mahjongId(val) {
        this.setMahjong(val);
    }

    setMahjong(mahjongId) {
        if (mahjongId == this._mahjongId) {
            return;
        }
        this._mahjongId = mahjongId;
        this.updateMahjong();
    }

    get mahjongId() {
        return this._mahjongId;
    }

    hidden = false;
    
    @property({ type:cc.Enum(GameConst.CardShowType) })
    set showType(val) {
        if (val == this._showType) {
            return;
        }
        this._showType = val;
        this.updateMahjong();
    };

    get showType() {
        return this._showType;
    }
    
    @property({ type:cc.Enum(GameConst.SitPos) })
    set sitPos(val) {
        if (val == this._sitPos) {
            return;
        }
        this._sitPos = val;
        GameUtil.clearChildren(this.node);
        this.updateMahjong();
    };

    get sitPos() {
        return this._sitPos;
    }

    protected onEnable(): void {
        super.onEnable();
        this._addEventListeners();
    }

    protected onDisable(): void {
        super.onDisable();
        this._removeEventListeners();
    }

    _addEventListeners() {
        cc.director.on(cc.Director.EVENT_AFTER_UPDATE, this.updateMahjong, this);
    }

    _removeEventListeners() {
        cc.director.off(cc.Director.EVENT_AFTER_UPDATE, this.updateMahjong, this);
    }

    _updateMahjongSprte() {
        let item;
        for (let child of this.node.children) {
            item = child.getComponent(MahjongUnitItem);
            if (item) break;
        }
        if (!item) {
            return;
        }
        item.setSitPos(this.sitPos);
        let data = { mahjongId: this.mahjongId, showType: this.showType }
        item.updateView(data);
        this.node.width = item.node.width;
        this.node.height = item.node.height;
        if (!CC_EDITOR) {
            item.showHun(GameMgr.ins.isHun(this.mahjongId));
        } else {
            item.showHun(false)
        }
    }

    showSelect(isSelect) {
        let child = this.node.children[0];
        let item = child.getComponent(MahjongUnitItem);
        item && item.showSelect(isSelect);
    }

    setHidden(hidden) {
        this.hidden = hidden;
        let child = this.node.children[0];
        if (child) {
            child.active = !hidden;
        }
    }

    updateMahjong() {
        if (this._mahjongId == null) {
            return;
        }
        if (this._loadingMahjongId != null) {
            this._loadingMahjongId = this._mahjongId;
            return;
        }
        if (this.node.children.length <= 0) {
            this._loadingMahjongId = this.mahjongId;
            let data = { mahjongId: this.mahjongId, showType: this.showType };
            UIMgr.createMahjongUnit(this.sitPos, this.node, data, (err, node) => {
                if (this._loadingMahjongId != this._mahjongId) {
                    this._updateMahjongSprte();
                }
                node.active = !this.hidden;
                this._loadingMahjongId = null;
            });
        } else {
            this._updateMahjongSprte();
        }    
    }

    setSitPos(sitPos) {
        this.sitPos = sitPos;
    }

    updateView(data) {
        if (this.showType == data.showType && this.mahjongId == data.mahjongId) {
            return;
        }
        this._showType = data.showType;
        this._mahjongId = data.mahjongId;
        this.updateMahjong();
    }

    CC_onClickMahjong() {
        console.log("点击了麻将", this.mahjongId, this._events);
        this.emit("click_card", this.mahjongId, this.node, this);
    }

    setClickEnable(enabled: boolean) {
        let comp = this.node.getComponent(cc.Button);
        if (comp) {
            comp.enabled = enabled;
        }
    }

    register(key: any, func: any): void {
        super.register(key, func);
        if (key == "click_card") {
            this.setClickEnable(true);
        }
    }
}