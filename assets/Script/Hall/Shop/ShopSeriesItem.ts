import UIMgr from "../../BaseUI/UIMgr";
import { NetDefine } from "../../Const/NetDefine";
import NetMgr from "../../Controller/Net/NetMgr";
import MeModel from "../../Global/MeModel";
import SDKMgr from "../../SDK/SDKMgr";
import RemoteFileLoader from "../../Util/RemoteFileLoader";
import HallNet from "../HallNet";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ShopSeriesItem extends cc.Component {

    @property(cc.Label)
    txt_seriesName: cc.Label;
    
    @property(cc.Label)
    txt_seriesDesc: cc.Label;
    
    @property(cc.Label)
    txt_money: cc.Label;

    @property(cc.Sprite)
    sp_prop: cc.Sprite;

    data: any;

    updateView(data: any) {
        this.data = data;
        this.txt_seriesName.string = data.seriesName;
        this.txt_seriesDesc.string = data.seriesDesc;
        this.txt_money.string = data.price;
        UIMgr.setCost(this.sp_prop, data.propId)
    }

    CC_onClickShopItem() {
        let data = {
            userId: MeModel.userId,
            rechageId: this.data.rechageId,
        };
        HallNet.C_Recharge(data, (ret) => {
            SDKMgr.ins.onWXPay(ret);
        });
    }
}