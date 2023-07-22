import UIMgr from "../BaseUI/UIMgr";
import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import MeModel from "../Global/MeModel";
import GameUtil from "../Util/GameUtil";
import RoomMgr from "./RoomMgr";
import RoomNet from "./RoomNet";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DissolveVoteView extends cc.Component {

    @property(cc.Node)
    node_gambers: cc.Node;

    @property(cc.Node)
    node_ops: cc.Node;

    @property(cc.Node)
    node_tips: cc.Node;

    protected onLoad(): void {
        NetMgr.addListener(this, NetDefine.WS_Resp.G_DissolveVote, this.G_DissolveVote);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_DissolveResult, this.G_DissolveResult);
        this.initView();
    }

    initView() {
        this.node_ops.active = true;
        this.node_tips.active = false;
        GameUtil.clearChildren(this.node_gambers);

        let dissolveVotes = RoomMgr.ins.getDissolveVote();
        for (let userId in dissolveVotes) {
            this.G_DissolveVote(dissolveVotes[userId]);
        }
    }

    G_DissolveResult(data) {
        if (!data.result) {
            UIMgr.showTip("房间解散失败");
        }
        UIMgr.closeSelf(this);
    }

    G_DissolveVote(data) {
        let userInfo = RoomMgr.ins.getGamber(data.userId);
        if (userInfo) {
            data.user = userInfo;
            UIMgr.createPrefab("DissolveVoteItem", this.node_gambers, data);
        }
        if (MeModel.isMe(data.userId)) {
            this.node_ops.active = false;
            this.node_tips.active = true;
        }
    }

    CC_onClickAgree() {
        RoomNet.C_DissolveVote(true);
    }

    CC_onClickReject() {
        RoomNet.C_DissolveVote(false);
    }
}