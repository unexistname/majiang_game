import GameUtil from "../Util/GameUtil";

const { ccclass, property, menu, executeInEditMode } = cc._decorator;

@ccclass
@menu("UI 组件/CustomLayout")
@executeInEditMode
export default class CustomLayout extends cc.Component {

    @property(cc.Node)
    node_posTable: cc.Node;

    seatNodes: { [key: number] : any } = {};

    addChild(node: cc.Node, localIndex: number) {
        this.seatNodes[localIndex] = node;
        this.node.addChild(node);
    }

    removeChild(localIndex: number) {
        if (this.seatNodes[localIndex]) {
            this.seatNodes[localIndex].parent = null;
            delete this.seatNodes[localIndex];
        }
    }

    onEnable() {
        this._addEventListeners();
        this._doLayoutDirty();
    }

    onDisable() {
        this._removeEventListeners();
    }
    
    _doLayout(children, showAnim=false) {
        for (let i = 0; i < children.length; ++i) {
            let child = children[i];
            if (child && child.activeInHierarchy) {
                let localIndex = this.findLocalIndex(child, i);
                let posNode = this.node_posTable.children[localIndex];
                if (posNode) {
                    child.scaleX = posNode.scaleX;
                    child.scaleY = posNode.scaleY;
                    let pos = posNode.getPosition();
                    if (showAnim) {
                        child.runAction(cc.moveTo(0.3, pos));
                    } else {
                        child.setPosition(pos);
                    }
                }
            }
        }
    }

    updateSeatIndex(oldSeatIndex, newSeatIndex) {
        let tmpSeatNodes = {};
        for (let localIndex in this.seatNodes) {
            for (let userId in oldSeatIndex) {
                if (oldSeatIndex[userId] == localIndex) {
                    let newLocalIndex = newSeatIndex[userId];
                    tmpSeatNodes[newLocalIndex] = this.seatNodes[localIndex];
                    break;
                }
            }
        }
        this.seatNodes = tmpSeatNodes;
        this._doLayout(this.node.children, true);
    }

    findLocalIndex(child, defaultValue) {
        let res = 0;
        if (!CC_EDITOR) {
            for (let localIndex in this.seatNodes) {
                if (this.seatNodes[localIndex] == child) {
                    res = Number(localIndex);
                    break;
                }
            }
        } else {
            res = defaultValue;
        }
        if (this.node.children.length <= 2 && res == 1) {
            res = 2;
        }
        return res;
    }

    swapNode(localIndex: number, anotherLocalIndex: number) {
        GameUtil.swap(this.seatNodes, localIndex, anotherLocalIndex);
        let pos1 = this.seatNodes[localIndex].position;
        let pos2 = this.seatNodes[anotherLocalIndex].position;
        this.seatNodes[localIndex].runAction(cc.moveTo(0.3, pos2));
        this.seatNodes[anotherLocalIndex].runAction(cc.moveTo(0.3, pos1));
    }

    _layoutDirty: boolean = true;

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