import UIMgr from "../../BaseUI/UIMgr";
import GlobalMgr from "../../GlobalMgr";
import { Combine } from "../../Util/Combine";
import LogUtil from "../../Util/LogUtil";
import HttpUtil from "./HttpUtil";
import WebSocketUtil from "./WebSocketUtil";

export default class NetMgr {
    // @Combine
    // httpUtil: HttpUtil;
    // @Combine
    // static socketUtil: WebSocketUtil = new WebSocketUtil();
    static get socketUtil() {
        return WebSocketUtil.ins;
    }

    static httpSend(path: string, data: Object, handler: Function, extraUrl?: string) {
        HttpUtil.httpSend(path, data, handler, extraUrl);
    }

    static tcpSend(cmd: number, msg: any, wsUri?: string) {
        if (wsUri) {
            this.changeTcpUrl(wsUri, () => {
                this.socketUtil.tcpSend(cmd, msg);
            })
        } else {
            this.socketUtil.tcpSend(cmd, msg);
        }
    }

    static changeTcpUrl(wsUri: string, onConnectSuccessCB?: Function, onConnectFailCB?: Function) {
        if (!wsUri.startsWith("ws://")) {
            wsUri = "ws://" + wsUri;
        }
        if (this.socketUtil.wsUri == wsUri) {
            if (this.socketUtil.isClose()) {

            } else if (this.socketUtil.isConnecting()) {
                this.socketUtil.addConnectCallBack(onConnectSuccessCB, onConnectFailCB);
                return;
            } else {
                onConnectSuccessCB && onConnectSuccessCB();
                return;
            }
        }
        let needClose = this.socketUtil.wsUri != null && this.socketUtil.wsUri.length > 0;
        LogUtil.Log(`切换ws路径，原始路径=[${this.socketUtil.wsUri}], 新路径=[${wsUri}]`);
        this.socketUtil.wsUri = wsUri;
        this.socketUtil.initLink(onConnectSuccessCB, onConnectFailCB, needClose);
    }

    static addListener(view, cmd, op) {
        op = op.bind(view);
        if (!view.node) {
            this.socketUtil.addListener(view, cmd, op, "manager");
        } else {
            this.socketUtil.addListener(view, cmd, op);
        }
    }

    static encryMsg(msg: any) {

    }
}