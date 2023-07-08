import UIMgr from "./BaseUI/UIMgr";
import { NetDefine } from "./Const/NetDefine";
import NetMgr from "./Controller/Net/NetMgr";
import MeModel from "./Global/MeModel";
import SDKMgr from "./SDK/SDKMgr";

const { ccclass } = cc._decorator;

@ccclass
export default class GlobalMgr extends cc.Component {
    private static _ins: GlobalMgr = null;
    public static get ins() {
        if (this._ins == null) {
            let node = UIMgr.getRoot();
            this._ins = node.getComponent(GlobalMgr);
        }
        return this._ins;
    }

    protected start(): void {
        cc.game.addPersistRootNode(this.node);
        UIMgr.setRoot(this.node);
        // @ts-ignore
        cc.sdk = SDKMgr.ins;

        NetMgr.addListener(this, NetDefine.WS_Resp.G_UpdateGem, this.G_UpdateGem);
    }

    G_UpdateGem(data) {
        if (MeModel.isMe(data.userId)) {
            MeModel.gems = data.gem;
        }
    }
}