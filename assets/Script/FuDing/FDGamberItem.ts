import GamberItem from "../Gamber/GamberItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FDGamberItem extends cc.Component {
    
    @property(GamberItem)
    item_gamber: GamberItem;

    userId: string;

    // protected start(): void {
    //     super.start();
    //     NetMgr.addListener(this, NetDefine.WS_Resp.G_DoOperate, this.G_DoOperate);    
    // }

    updateView(data) {
        this.userId = data.userId;
        this.item_gamber.updateView(data);
    }

    // G_DoOperate(data) {
    //     if (this.userId == data.userId) {
    //         if (data.value) {
    //             let betting = Number(this.txt_betting.string) + data.value;
    //             this.txt_betting.string = betting.toString();
    //             this.node_betting.active = true;
    //         }
    //     }
    // }
}