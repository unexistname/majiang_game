import UIMgr from "../../BaseUI/UIMgr";
import HallNet from "../HallNet";


const { ccclass, property } = cc._decorator;

@ccclass
export default class TransferGemView extends cc.Component {

    @property(cc.EditBox)
    edit_transfer: cc.EditBox;
    
    @property(cc.EditBox)
    edit_userId: cc.EditBox;

    CC_onClickTransfer() {
        let userId = this.edit_userId.string;
        let gemNum = Number(this.edit_transfer.string);
        HallNet.C_TransferGem(userId, gemNum);
    }

    CC_onClickClose() {
        UIMgr.closeSelf(this);
    }
}