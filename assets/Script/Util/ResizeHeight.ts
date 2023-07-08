
const { ccclass, property } = cc._decorator;

@ccclass
export default class ResizeHeight extends cc.Component {

    @property(cc.Node)
    node_target: cc.Node;

    protected start(): void {
        this.node.height = this.node_target.height;
    }
}