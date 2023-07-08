import UIMgr from "../BaseUI/UIMgr";
import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import MeModel from "../Global/MeModel";
import MJNet from "./MJNet";
import MJOperate from "./MJOperate";


const { ccclass, property } = cc._decorator;

@ccclass
export default class MJOperateView extends cc.Component {

    @property(cc.Node)
    node_chi: cc.Node;
    
    @property(cc.Node)
    node_peng: cc.Node;
    
    @property(cc.Node)
    node_gang: cc.Node;
    
    @property(cc.Node)
    node_hu: cc.Node;
    
    @property(cc.Node)
    node_zimo: cc.Node;
    
    @property(cc.Node)
    node_guo: cc.Node;

    data: any;

    protected start(): void {
        NetMgr.addListener(this, NetDefine.WS_Resp.G_MJOperate, this.G_MJOperate);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_DoOperate, this.G_DoOperate);
        this.node.active = false;
    }

    G_DoOperate(data) {
        if (MeModel.isMe(data.userId)) {
            this.node.active = false;
        }
    }

    G_MJOperate(data) {
        if (MeModel.isMe(data.userId)) {
            this.data = data;
            this.node.active = true;
            this.updateOptionalOperate(data.optionalOperate);
        }
    }

    updateOptionalOperate(op) {
        this.node_chi.active = !!(op & MJOperate.CHI);
        this.node_peng.active = !!(op & MJOperate.PENG);
        this.node_gang.active = !!(op & MJOperate.GANG);
        this.node_hu.active = !!(op & MJOperate.HU);
        this.node_zimo.active = !!(op & MJOperate.ZI_MO);
        this.node_guo.active = !!(op & MJOperate.GUO);
    }

    CC_onClickChi() {
        if (this.data.chiPai) {
            if (this.data.chiPai.length > 1) {
                UIMgr.showView("MJOperateSelectView", this.data);
            } else {
                MJNet.C_Chi(this.data.chiPai[0].index);
            }
        }
    }

    CC_onClickPeng() {
        MJNet.C_Peng();
    }

    CC_onClickGang() {
        if (this.data.gangPai) {
            if (this.data.gangPai.length > 1) {
                UIMgr.showView("MJOperateSelectView", this.data);
            } else {
                MJNet.C_Gang(this.data.gangPai[0]);
            }
        }
    }

    CC_onClickGuo() {
        MJNet.C_Guo();
    }

    CC_onClickHu() {
        MJNet.C_Hu();
    }

    CC_onClickZiMo() {
        MJNet.C_ZiMo();
    }
}