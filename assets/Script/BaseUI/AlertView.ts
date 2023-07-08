import UIMgr from "./UIMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class AlertView extends cc.Component {

    @property(cc.Label)
    txt_content: cc.Label;

    successCB: Function;
    failCB: Function;

    updateView(data) {
        this.txt_content.string = data.content;
        this.successCB = data.successCB;
        this.failCB = data.failCB;
    }

    CC_onClickConfirm() {
        this.successCB && this.successCB();
        UIMgr.closeSelf(this);
    }

    CC_onClickCancel() {
        this.failCB && this.failCB();
        UIMgr.closeSelf(this);
    }

    CC_onClickClose() {
        UIMgr.closeSelf(this);
    }
}