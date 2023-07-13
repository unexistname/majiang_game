const { ccclass } = cc._decorator;
let Websocket = require("./Websocket");
import NetState from "../../Const/Game/NetState";
import { GameConst } from "../../Const/GameConst";
import LogUtil from "../../Util/LogUtil";
import MeModel from "../../Global/MeModel";
import UIMgr from "../../BaseUI/UIMgr";
import UrlModel from "../../Global/UrlModel";
import { NetDefine } from "../../Const/NetDefine";

@ccclass
export default class WebSocketUtil extends cc.Component {
    private static _ins: WebSocketUtil = null;
    public static get ins() {
        if (this._ins == null) {
            this._ins = UIMgr.getRoot().getComponent(WebSocketUtil);
        }
        return this._ins;
    }

    wsUri: string = "";
    wsConn: any = null;
    state: NetState;
    isSleep: boolean = false;
    receivePong: boolean = false;
    tcpListeners: any[] = [];
    tcpViewListeners: any[] = [];
    timeoutTimer: any = null;
    reconnectTime = 0;

    onConnectSuccessCB: any = null;
    onConnectFailCB: any = null;

    encryFuncs: {} = {};
    decryFuncs: {} = {};

    onLoad() {
        this.wsConn = new Websocket();
        this.state = NetState.UNCONNECT;

        setInterval(this.heartBeat.bind(this), GameConst.Config.NET_HEART_BEAT_INTERVAL);

        cc.game.on(cc.game.EVENT_HIDE, () => {
            this.isSleep = true;
            this.wsConn.close();
            this.changeState(NetState.CLOSED);
            this.receivePong = true;

            cc.director.emit(GameConst.SystemSignal.SYSTEM_PAUSE);
        });
        cc.game.on(cc.game.EVENT_SHOW, () => {
            cc.director.emit(GameConst.SystemSignal.SYSTEM_RESUME);
            // cc.vv.eventManager.removeAllEvent();
            this.isSleep = false;
            if (this.state == NetState.UNCONNECT) {
                return;
            }
            if (this.isClose()) {
                this.reconnect();
            }
        });
    }

    isConnecting() {
        return this.state == NetState.CONNECTING;
    }

    isClose() {
        return this.state == NetState.CLOSED || this.state == NetState.FAILED;
    }

    changeState(state: NetState, ...args: any[]) {
        this.state = state;
        if (state == NetState.CONNECTING) {
            cc.director.emit(GameConst.NetSignal.NET_CONNECTING);
            LogUtil.Log("Network Connecting", this.wsUri);
        } else if (state == NetState.CONNECTED) {
            cc.director.emit(GameConst.NetSignal.NET_CONNECT_SUCCESS);
            LogUtil.Log("Network Connected", args);
        } else if (state == NetState.FAILED) {
            cc.director.emit(GameConst.NetSignal.NET_CONNECT_FAIL);
            LogUtil.Error("Network Failed", args);
        } else if (state == NetState.CLOSED) {
            cc.director.emit(GameConst.NetSignal.NET_CLOSE);
        } else if (state == NetState.RECONNECT_FAIL) {
            cc.director.emit(GameConst.NetSignal.NET_CONNECT_FAIL);
            LogUtil.Log("Network Reconnect Fail", args);
        }
    }

    addConnectCallBack(onConnectSuccessCB?: Function, onConnectFailCB?: Function) {
        if (onConnectSuccessCB) {
            if (this.onConnectSuccessCB) {
                let fn = this.onConnectSuccessCB;
                this.onConnectSuccessCB = () => {
                    fn();
                    onConnectSuccessCB();
                }
            } else {
                this.onConnectSuccessCB = onConnectSuccessCB;
            }
        }
        if (onConnectFailCB) {
            if (this.onConnectFailCB) {
                let fn = this.onConnectFailCB;
                this.onConnectFailCB = () => {
                    fn();
                    onConnectFailCB();
                }
            } else {
                this.onConnectFailCB = onConnectFailCB;
            }
        }
    }

    initLink(onConnectSuccessCB?: Function, onConnectFailCB?: Function, needClose = false){
        if (this.wsUri == null || this.wsUri.length <= 0) {
            return;
        }
        if (this.isConnecting()) {
            return;
        }
        this.timeoutTimer && clearTimeout(this.timeoutTimer);
        this.timeoutTimer = null;

        try{
            this.onConnectSuccessCB = onConnectSuccessCB;
            this.onConnectFailCB = onConnectFailCB;
            this.changeState(NetState.CONNECTING);
            LogUtil.Log("[WebSocket init link]", this.wsUri, this.onConnectSuccessCB, this.onConnectFailCB, !needClose);
            this.wsConn.connect(
                this.wsUri,
                this.onOpen.bind(this),
                this.onClose.bind(this),
                this.onError.bind(this),
                this.onMessage.bind(this)
            );
        } catch (e) {
            this.reconnect();
            // this.changeState(NetState.FAILED, e);
        }
    }
    
    addListener(view, cmd, op, type = "view") {
        if (type == "view") {
            this.tcpViewListeners.push({view: view, cmd: cmd, op: op});
        } else {
            this.tcpListeners.push({cmd: cmd, op: op});
        }
    }

    onOpen(evt) {
        LogUtil.Log("Network Connected");
        this.receiveHeartBeatPacket("pong");
        this.changeState(NetState.CONNECTED);

        this.wsConn.send(this.getNetType(), {cmd:0, userId: MeModel.userId});

        this.reconnectTime = 0;
        this.onConnectFailCB = null;

        let cb = this.onConnectSuccessCB;
        this.onConnectSuccessCB = null;
        cb && cb();
    }
 
    onClose (evt) {
        if (this.state == NetState.CONNECTING || this.state == NetState.UNCONNECT || this.isSleep) {
            return;
        }
        this.changeState(NetState.CLOSED);
        LogUtil.Log(6,"Network DISCONNECTED" + evt);
        this.reconnect();
    }

    onError (evt) {
        if (this.state == NetState.CONNECTING || this.state == NetState.UNCONNECT || this.isSleep) {
            return;
        }
        this.changeState(NetState.FAILED, evt);
        LogUtil.Log(6,"Network ERROR: "+ evt);
        this.reconnect();
    }

    onReconnectFail() {
        let cb = this.onConnectFailCB;
        this.onConnectFailCB = null;
        cb && cb();
    }

    onMessage (commandId, data) {
        if (this.receiveHeartBeatPacket(data)) {
            return;
        }
        LogUtil.Log("收到消息: ",commandId,JSON.stringify(data));

        if (!data.hasOwnProperty('cmd')) {
            LogUtil.Error("invalid JSON response data, doesn't include cmd");
            return;
        }
        if (data.cmd == NetDefine.WS_Resp.G_Error) {
            UIMgr.showError(data.result);
            return;
        }
        this.decryFuncs[data.cmd] && this.decryFuncs[data.cmd](data.result);
        LogUtil.Log("解密后消息：", NetDefine.WS_Resp[data.cmd], data.result);

        
        for (let listener of this.tcpListeners) {
            if (listener["cmd"] != data.cmd) {
                continue;
            }
            listener["op"] && listener["op"](data.result);
        }

        let needRemove = [];
        for (let listener of this.tcpViewListeners) {
            if (listener["cmd"] != data.cmd) {
                continue;
            }
            if (listener["view"] && listener["view"].node == null) {
                needRemove.push(listener);
                continue;
            }
            listener["op"] && listener["op"](data.result);
        }
        while (needRemove.length > 0) {
            let listener = needRemove.pop();
            let index = this.tcpViewListeners.indexOf(listener);
            this.tcpViewListeners.splice(index, 1);
        }
    }
    
    // //大厅发送消息
    // doSend1 (c, m) { 
    //     var packet = {cmd:c, msg:m};
    //     LogUtil.Log(6,"发送消息: " + JSON.stringify(packet));
    //     this.wsConn.send(1, packet);
    // }

    // //游戏发送消息
    // doSend2 (c, m) { 
    //     var packet = {cmd:c, msg:m};
    //     LogUtil.Log(6,"发送消息: " + JSON.stringify(packet));
    //     this.wsConn.send(2, packet);
    // }

    registerEncry(cmd, func) {
        this.encryFuncs[cmd] = func;
    }

    registerDecry(cmd, func) {
        this.decryFuncs[cmd] = func;
    }

    tcpSend(cmd, msg) {
        this.encryFuncs[cmd] && this.encryFuncs[cmd](msg);
        let packet = {cmd:cmd, msg:msg};
        LogUtil.Log("发送消息: ", NetDefine.WS_Req[cmd], JSON.stringify(msg));
        this.wsConn.send(this.getNetType(), packet);
    }

    getNetType() {
        if (UrlModel.hallUrl && this.wsUri.indexOf(UrlModel.hallUrl) >= 0) {
            return 1;
        } else if (UrlModel.gameUrl && this.wsUri.indexOf(UrlModel.gameUrl) >= 0) {
            return 2;
        }
        return 0;
    }

    // tcpBroadcastSend(cmd, msg) {
    //     let packet = {cmd:cmd, msg:msg};
    //     LogUtil.Log("发送广播消息: " + JSON.stringify(packet));
    //     this.wsConn.send(1, packet);
    // }

    reconnect() {
        console.log("开始重连");
        this.reconnectTime += 1;
        if (this.reconnectTime <= 3) {
            this.initLink();
        } else {
            this.reconnectTime = 0;
            this.changeState(NetState.RECONNECT_FAIL);
            this.onReconnectFail()
        }
    }

    timeoutHandler() {
        if (this.isClose() || this.isSleep) {
            return;
        }
        if(!this.receivePong){
            this.reconnect();
        }
    }

    heartBeat(){
        if (this.isClose() || this.state == NetState.UNCONNECT || this.isSleep) return;
        this.sendHeartBeatPacket();

        if (this.timeoutTimer == null) {
            this.timeoutTimer = setTimeout(this.timeoutHandler.bind(this), GameConst.Config.NET_HEART_BEAT_TIMEOUT);
        }
    }

    sendHeartBeatPacket() {
        this.wsConn.send(3, {cmd:"ping"});
        this.receivePong = false;
    }

    receiveHeartBeatPacket(data: any) {
        if(data == "pong"){
            this.receivePong = true;
            this.timeoutTimer && clearTimeout(this.timeoutTimer);
            this.timeoutTimer = null;
            return true;
        }
        return false;
    }

    update() {
        if(this.isSleep) {
            this.isSleep = false;
        }
    }
}
