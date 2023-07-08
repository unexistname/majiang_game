import UIMgr from "./UIMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TipsView extends cc.Component {

    @property(cc.Label)
    txt_content: cc.Label;

    updateView(data) {
        this.txt_content.string = data;
        this.node.runAction(cc.sequence(
            cc.moveBy(1, 0, 100),
            cc.callFunc(() => {
                UIMgr.closeSelf(this);
            }),
        ));
    }
}