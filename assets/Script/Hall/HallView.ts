import UIMgr from "../BaseUI/UIMgr";
import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import AudioTool from "../Global/AudioTool";
import MeModel from "../Global/MeModel";
import GameUtil from "../Util/GameUtil";
import HallMgr from "./HallMgr";
import HallNet from "./HallNet";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HallView extends cc.Component {

    @property(cc.Sprite)
    sp_avatar: cc.Sprite;

    @property(cc.Label)
    txt_name: cc.Label;

    @property(cc.Label)
    txt_userId: cc.Label;

    @property(cc.Label)
    txt_gem: cc.Label;

    start() {        
        UIMgr.setSprite(this.sp_avatar, MeModel.headImg);
        this.txt_userId.string = MeModel.userId;
        this.txt_name.string = GameUtil.cutString(MeModel.userName, 16);
        this.txt_gem.string = "" + MeModel.gems;

        NetMgr.addListener(this, NetDefine.WS_Resp.G_EnterHall, this.G_EnterHall);
        // NetMgr.addListener(this, NetDefine.WS_Resp.G_ShowCreateRoom, this.G_ShowCreateRoom);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_ShowRecord, this.G_ShowRecord);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_TransferGem, this.G_TransferGem);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_UpdateGem, this.G_UpdateGem);
        AudioTool.ins.playHallBGM();
    }
    
    G_TransferGem(data) {
        if (MeModel.isMe(data.userId)) {
            UIMgr.showTip(`转让${data.gem}钻石成功`);
        } else if (MeModel.isMe(data.userId2)) {
            UIMgr.showTip(`${data.userId}向你转让了${data.gem}钻石`);
        } else {
            
        }
    }

    G_UpdateGem(data) {
        if (MeModel.isMe(data.userId)) {
            this.txt_gem.string = "" + data.gem;
        }
    }

    CC_onClickEnterHall() {
        HallNet.C_EnterHall();
    }

    G_EnterHall(data) {
        UIMgr.showView("HallRoomView", data);
    }

    CC_onClickCreateRoom() {
        HallMgr.ins.showCreateRoom();
    //     HallNet.C_ShowCreateRoom();
    }

    // G_ShowCreateRoom() {
    //     HallMgr.ins.needShowCreate = true;

    //     let data = HallMgr.ins.getRoomConfs();
    //     if (data) {
    //         UIMgr.showView("CreateRoomView", data);   
    //     } else {

    //         HallNet.C_ShowCreateRoom();
    //     }
    // }

    CC_onClickJoinRoom() {
        UIMgr.showView("JoinRoomView");
    }

    CC_onClickRecord() {
        HallNet.C_ShowRecord();
    }

    G_ShowRecord(data) {
        UIMgr.showView("RecordView", data);
    }
    
    CC_onClickShop() {
        HallNet.C_ShowRecharge((ret) => {
            UIMgr.showView("ShopView", ret);
        });
    }

    CC_onClickSetting() {
        UIMgr.showView("SettingView");
    }

    CC_onClickTransfer() {
        UIMgr.showView("TransferGemView");
    }
}