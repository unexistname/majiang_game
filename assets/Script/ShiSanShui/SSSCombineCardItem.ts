import { SSSCardType } from "./SSSCardType";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SSSCombineCardItem extends cc.Component {

    @property(cc.Label)
    txt_headType: cc.Label;

    @property(cc.Label)
    txt_middleType: cc.Label;

    @property(cc.Label)
    txt_tailType: cc.Label;

    @property(cc.Label)
    txt_specialType: cc.Label;

    @property(cc.Node)
    node_common: cc.Node;

    clickCB: Function;

    data: any;

    updateView(data) {
        if (data.special) {
            this.node_common.active = false;
            this.txt_specialType.string = SSSCardType.getCardTypeDesc(data.special);
        } else {
            this.txt_specialType.node.active = false;
            this.txt_headType.string = SSSCardType.getCardTypeDesc(data.head);
            this.txt_middleType.string = SSSCardType.getCardTypeDesc(data.middle);
            this.txt_tailType.string = SSSCardType.getCardTypeDesc(data.tail);
        }
        this.clickCB = data.clickCB;
        this.data = data;
    }

    CC_onClickCardType() {
        this.clickCB && this.clickCB(this.data);
    }
}