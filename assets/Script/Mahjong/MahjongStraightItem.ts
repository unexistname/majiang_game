import UIMgr from "../BaseUI/UIMgr";
import { GameConst } from "../Const/GameConst";
import MJStraightLayout from "../Util/MJStraightLayout";
import CardEventHandle from "./CardEventHandle";
import MahjongItem from "./MahjongItem";

const { ccclass, menu, property, executeInEditMode } = cc._decorator;

@ccclass
@menu("麻将组件/MahjongStraight")
@executeInEditMode
export default class MahjongStraightItem extends CardEventHandle {

    _mahjongs: Array<number> = [];

    @property({ type: [cc.Integer] })
    set mahjongs(val) {
        this.updateMahjongs(val);
    }

    get mahjongs() {
        return this._mahjongs;
    }

    _showType: GameConst.CardShowType = GameConst.CardShowType.STAND;

    _sitPos: GameConst.SitPos = GameConst.SitPos.DOWN;

    get sitPos() {
        return this._sitPos;
    }
    
    @property({ type:cc.Enum(GameConst.SitPos) })
    set sitPos(val) {
        if (val == this._sitPos) {
            return;
        }
        this._sitPos = val;

        this.node.getComponent(MJStraightLayout).sitPos = val;
    };
    
    @property({ type:cc.Enum(GameConst.CardShowType) })
    set showType(val) {
        if (val == this._showType) {
            return;
        }
        this._showType = val;

        for (let mahjongItem of this.node.children) {
            mahjongItem.getComponent(MahjongItem).showType = val;
        }
    };

    get showType() {
        return this._showType;
    }

    loading: {} = {};
    loadingNodes: {} = {};

    updateLayout() {
        this.updateMahjongs(this.mahjongs);
    }

    updateMahjongs(mahjongs, callback?: Function) {
        this._mahjongs = mahjongs;
        let mahjongItems = this.node.children;
        for (let i = 0; i < mahjongs.length; ++i) {
            let mahjongId = mahjongs[i];
            if (this.loading[i] || this.loadingNodes[i]) {
                continue;
            }
            if (!mahjongItems[i]) {
                this._addMahjongItem(i, mahjongId, callback);
            } else {
                mahjongItems[i].getComponent(MahjongItem).mahjongId = mahjongId;
                mahjongItems[i].active = true;
            }
        }
        for (let i = mahjongs.length; i < mahjongItems.length; ++i) {
            if (mahjongItems[i]) {
                mahjongItems[i].active = false;
            }
        }
    }

    _addMahjongItem(index, mahjongId, callback?: Function) {
        let data = {mahjongId: mahjongId, showType: this.showType};

        this.loading[index] = true;
        UIMgr.createMahjongItem(this.sitPos, null, data, (err, node) => {
            this.loading[index] = false;
            this.loadingNodes[index] = node;
            for (let i = this.node.children.length; this.loadingNodes[i]; i = this.node.children.length) {
                this.node.addChild(this.loadingNodes[i]);
                // this.collect(this.loadingNodes[i]);
                this.adjustSize();
                if (this._mahjongs[i] == null) {
                    this.loadingNodes[i].active = false;
                } else {
                    let item = this.loadingNodes[i].getComponent(MahjongItem);
                    if (item.mahjongId != this._mahjongs[i]) {
                        item.mahjongId = this._mahjongs[i];
                    }
                    this.loadingNodes[i].active = true;
                }
                this.loadingNodes[i] = null;
            }
            callback && callback(index, node);
        });
    }

    adjustSize() {
        switch (this.sitPos) {
            case GameConst.SitPos.TOP:
            case GameConst.SitPos.DOWN:
                this.node.height = this.node.children[0].height;
                this.node.width = this.node.children[0].width * this.node.children.length;
                break;
            case GameConst.SitPos.LEFT:
            case GameConst.SitPos.RIGHT:
                this.node.width = this.node.children[0].width;
                this.node.height = this.node.children[0].height * this.node.children.length;
                break;
        }
    }
}