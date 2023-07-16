import UIMgr from "../BaseUI/UIMgr";


const { ccclass, property } = cc._decorator;

@ccclass
export default class GamberVoiceItem extends cc.Component {
    
    @property(cc.Node)
    node_volumes: cc.Node;

    currentVolume: number = 0;

    startTime: number;

    updateView(data) {
        this.adjustPos(data.pos);
        this.startTime = Date.now();
        let time = data.time / 1000;

        this.node.runAction(cc.sequence(
            cc.fadeIn(0.1),
            cc.delayTime(time),
            cc.fadeOut(0.1),
            cc.callFunc(() => {
                UIMgr.closeSelf(this);
            })));
    }

    adjustPos(pos) {
        let left = false, top = true;
        if (pos.x < 0) {
            left = true;
        }
        if (pos.y < 0) {
            top = false;
        }
        let width = this.node.width;
        let offsetX = left ? width : -width;
        let itemPos = new cc.Vec2(pos.x + offsetX, pos.y);
        this.node.setPosition(itemPos);
        this.adjustBg(left, top);
    }

    adjustBg(left: boolean, top: boolean) {
        if (left) {
            this.node.scaleX *= -1;
        }
    }

    updateVolume() {
        this.currentVolume = (this.currentVolume + 1) % 3;
        let volumeNodes = this.node_volumes.children;
        for(let i = 0; i < volumeNodes.length; ++i){
            volumeNodes[i].active = i == this.currentVolume;
        }
    }

    protected update(dt: number): void {
        if (Date.now() - this.startTime > 300) {
            this.updateVolume();
            this.startTime = Date.now();
        }
    }
}