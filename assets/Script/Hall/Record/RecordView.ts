import UIMgr from "../../BaseUI/UIMgr";
import { NetDefine } from "../../Const/NetDefine";
import NetMgr from "../../Controller/Net/NetMgr";
import RecordItem from "./RecordItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RecordView extends cc.Component {

    @property(cc.Prefab)
    prefab_record: cc.Prefab;

    @property(cc.Node)
    node_records: cc.Node;

    // protected start(): void {
    //     NetMgr.addListener(this, NetDefine.WS_Resp.G_ShowRecord, this.G_ShowRecord);
    //     this.node.active = false;
    // }

    G_ShowRecord(data) {
        this.node.active = true;
        for (let record of data.records) {
            UIMgr.createNode(this.prefab_record, this.node_records, RecordItem, record);
        }
    }

    updateView(data) {
        this.G_ShowRecord(data);
    }

    CC_onClickClose() {
        UIMgr.closeSelf(this);
    }
}