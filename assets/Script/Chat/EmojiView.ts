import UIMgr from "../BaseUI/UIMgr";
import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class EmojiView extends cc.Component {

    @property(cc.Node)
    node_emojis: cc.Node;

    @property(cc.SpriteAtlas)
    spriteAltas: cc.SpriteAtlas;

    protected start(): void {
        // this.initView();
        NetMgr.addListener(this, NetDefine.WS_Resp.G_Emoji, this.CC_onClickClose);
    }

    // initView() {
    //     let frames = this.spriteAltas.getSpriteFrames();
    //     for (let frame of frames) {
    //         if (/[^\d]*0/.test(frame.name)) {
    //             let content = this.getFormat(frame.name);
    //             let data = { spriteFrame: frame, content: content };
    //             UIMgr.createPrefab("EmojiButton", this.node_emojis, data);
    //         }
    //     }
    // }

    // getFormat(name) {
    //     let res = "";
    //     for (let ch of name) {
    //         if (ch >= '0' && ch <= '9') {
    //             break;
    //         }
    //         res += ch;
    //     }
    //     console.log("kkkkkkkkkkkkk", name, res);
    //     return res;
    // }

    CC_onClickClose() {
        UIMgr.closeSelf(this);
    }
}