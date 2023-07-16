import UIMgr from "../BaseUI/UIMgr";
import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import RoomNet from "../Room/RoomNet";
import PropItem from "./PropItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GamberInfoView extends cc.Component {

    @property(cc.Sprite)
    sp_avatar: cc.Sprite;

    @property(cc.Label)
    txt_userName: cc.Label;

    @property(cc.Label)
    txt_userId: cc.Label;

    @property(cc.EditBox)
    edit_transfre: cc.EditBox;

    @property(cc.Label)
    txt_distance: cc.Label;

    @property(cc.Node)
    node_distance: cc.Node;

    @property(cc.Node)
    node_unopen: cc.Node;

    @property(cc.Label)
    txt_winRate: cc.Label;

    @property(cc.Node)
    node_props: cc.Node;

    @property(cc.Prefab)
    prefab_prop: cc.Prefab;

    userId: string;

    protected onLoad(): void {
        this.node.active = false;
        NetMgr.addListener(this, NetDefine.WS_Resp.G_GamberInfo, this.G_GamberInfo);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_ShowProp, this.G_ShowProp);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_UseProp, this.G_UseProp);
        cc.director.on("click_prop", this.C_UseProp, this);
    }

    protected onDestroy(): void {
        cc.director.off("click_prop", this.C_UseProp, this);
    }
    
    G_GamberInfo(data) {
        this.userId = data.userId;
        UIMgr.setAvatar(this.sp_avatar, data.avatarUrl);
        this.txt_userId.string = data.userId;
        this.txt_userName.string = data.userName;
        this.txt_winRate.string = data.winRate;
        this.node.active = true;
    }

    G_ShowProp(data) {
        for (let propId in data) {
            UIMgr.createNode(this.prefab_prop, this.node_props, PropItem, data[propId]);
        }
    }

    updateView(userId) {
        RoomNet.C_GamberInfo(userId);
        RoomNet.C_ShowProp();
    }

    C_UseProp(propId) {
        RoomNet.C_UseProp(this.userId, propId);
    }

    G_UseProp() {
        UIMgr.closeSelf(this);
    }

    CC_onClickTransfer() {
        let gemNum = Number(this.edit_transfre.string);
        RoomNet.C_TransferGem(this.userId, gemNum);
    }

    CC_onClickClose() {
        UIMgr.closeSelf(this);
    }
}