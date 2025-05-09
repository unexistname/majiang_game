import RoomMgr from "../Room/RoomMgr";
import GameUtil from "./GameUtil";

const { ccclass, property, menu, executeInEditMode } = cc._decorator;


@ccclass
@menu("UI 组件/EllipseLayout")
@executeInEditMode
export default class EllipseLayout extends cc.Component {

    seatNodes: { [key: number] : any } = {};

    @property({type:cc.Integer, tooltip:"固定节点位置，让节点不随子节点个数而变化"})
    fixNodeCnt: number = 0;

    @property({type:[cc.Integer], tooltip:"当子节点个数为这个数字时，会使用比这个数字更大的布局"})
    skipCnt: Array<number> = [];

    onEnable() {
        this._addEventListeners();
        this._doLayoutDirty();
    }

    mode: number = -1;

    setMode(mode) {
        this.mode = mode;
        this._doLayoutDirty();
    }

    onDisable() {
        this._removeEventListeners();
    }

    addChild(node: cc.Node, localIndex: number) {
        this.seatNodes[localIndex] = node;
        this.node.addChild(node);
        // this.updateLayout();
    }

    removeChild(localIndex: number) {
        if (this.seatNodes[localIndex]) {
            this.seatNodes[localIndex].parent = null;
            delete this.seatNodes[localIndex];
        }
    }

    swapNode(localIndex: number, anotherLocalIndex: number, callback?: Function) {
        const MOVE_TIME = 0.3;
        GameUtil.swap(this.seatNodes, localIndex, anotherLocalIndex);
        let pos1 = this.seatNodes[localIndex].position;
        let pos2 = this.seatNodes[anotherLocalIndex].position;
        this.seatNodes[localIndex].runAction(cc.moveTo(MOVE_TIME, pos2));
        this.seatNodes[anotherLocalIndex].runAction(cc.moveTo(MOVE_TIME, pos1));
        if (callback) {
            setTimeout(callback, MOVE_TIME);
        }
    }

    getChildren() {
        return this.node.children;
    }

    getEllipsePos(angle: number) {
        let A = this.node.width / 2;
        let B = this.node.height / 2;
        let x0 = this.node.position.x;
        let y0 = this.node.position.y;
        let rad = angle * Math.PI / 180;
        let div = Math.sqrt(Math.pow(A * Math.sin(rad), 2) + Math.pow(B * Math.cos(rad), 2));
        let x = x0 + (A * B * Math.cos(rad)) / div;
        let y = y0 + (A * B * Math.sin(rad)) / div;
        return new cc.Vec2(x, y);
    }

    _layoutDirty: boolean = true;
    
    _doLayout(children, showAnim = false) {
        let activeChildCount = 0;
        for (let i = 0; i < children.length; ++i) {
            let child = children[i];
            if (child.activeInHierarchy) {
                activeChildCount++;
            }
        }
        if (!CC_EDITOR) {
            activeChildCount = RoomMgr.ins.getSeatNum();
        }

        while (this.skipCnt.indexOf(activeChildCount) >= 0) {
            activeChildCount++;
        }

        if (this.fixNodeCnt) {
            activeChildCount = this.fixNodeCnt;
        }

        for (let i = 0; i < children.length; ++i) {
            let child = children[i];
            if (child && child.activeInHierarchy) {
                let localIndex = this.findLocalIndex(child, i);
                let angle = (360 / activeChildCount * localIndex) - 90;
                let pos = this.getEllipsePos(angle);
                child.stopAllActions();
                this.dealMode(localIndex, child);
                if (showAnim) {
                    child.runAction(cc.moveTo(0.3, pos));
                } else {
                    child.setPosition(pos);
                }
            }
        }
    }

    updateSeatIndex(oldSeatIndex, newSeatIndex) {
        let tmpSeatNodes = {};
        for (let userId in oldSeatIndex) {
            let localIndex = oldSeatIndex[userId];
            let node = this.seatNodes[localIndex];
            for (let newUserId in newSeatIndex) {
                if (userId == newUserId) {
                    let newLocalIndex = newSeatIndex[newUserId];
                    tmpSeatNodes[newLocalIndex] = node;
                }
            }
        }
        this.seatNodes = tmpSeatNodes;
        this._doLayout(this.node.children, true);
    }

    dealMode(localIndex, child) {
        if (this.mode == 0) {
            if (localIndex == 0) {
                child.scaleX = 1.8;
                child.scaleY = 1.8;
            } else {
                child.scaleX = 1;
                child.scaleY = 1;
            }
            // if (localIndex != 0) {
            //     child.scaleX = 0.8;
            //     child.scaleY = 0.8;
            // }
        } else if (this.mode == 1) {
            if (localIndex == 0) {
                child.scaleX = 1.5;
                child.scaleY = 1.5;
            } else {
                child.scaleX = 1;
                child.scaleY = 1;
            }
        } else if (this.mode == 2) {
            if (localIndex == 0) {
                child.scaleX = 1.8;
                child.scaleY = 1.8;
            } else {
                child.scaleX = 1;
                child.scaleY = 1;
            }
        }
    }

    findLocalIndex(child, defaultValue) {
        if (!CC_EDITOR) {
            for (let localIndex in this.seatNodes) {
                if (this.seatNodes[localIndex] == child) {
                    return Number(localIndex);
                }
            }
        }
        return defaultValue;
    }

    _addEventListeners() {
        cc.director.on(cc.Director.EVENT_AFTER_UPDATE, this.updateLayout, this);
        this.node.on(cc.Node.EventType.ANCHOR_CHANGED, this._doLayoutDirty, this);
        this.node.on(cc.Node.EventType.CHILD_ADDED, this._childAdded, this);
        this.node.on(cc.Node.EventType.CHILD_REMOVED, this._childRemoved, this);
        this.node.on(cc.Node.EventType.CHILD_REORDER, this._doLayoutDirty, this);
    }

    _removeEventListeners() {
        cc.director.off(cc.Director.EVENT_AFTER_UPDATE, this.updateLayout, this);
        this.node.off(cc.Node.EventType.ANCHOR_CHANGED, this._doLayoutDirty, this);
        this.node.off(cc.Node.EventType.CHILD_ADDED, this._childAdded, this);
        this.node.off(cc.Node.EventType.CHILD_REMOVED, this._childRemoved, this);
        this.node.off(cc.Node.EventType.CHILD_REORDER, this._doLayoutDirty, this);
    }

    _childAdded(child) {
        child.on('active-in-hierarchy-changed', this._doLayoutDirty, this);
        this._doLayoutDirty();
    }

    _childRemoved(child) {
        child.off('active-in-hierarchy-changed', this._doLayoutDirty, this);
        this._doLayoutDirty();
    }

    _doLayoutDirty () {
        this._layoutDirty = true;
    }
    
    updateLayout() {
        if (this._layoutDirty && this.node.children.length > 0) {
            this._doLayout(this.node.children);
            this._layoutDirty = false;
        }
    }
}