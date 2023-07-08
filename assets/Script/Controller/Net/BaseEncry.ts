import { NetDefine } from "../../Const/NetDefine";
import EncryUtils from "../../Util/EncryUtils";
import LogUtil from "../../Util/LogUtil";
import WebSocketUtil from "./WebSocketUtil";


export default class BaseEncry {

    register() {
        let ctx = Object.getPrototypeOf(this);
        let funcNames = Reflect.ownKeys(ctx);
        for (let funcName of funcNames) {
            if (funcName == "constructor") {
                continue;
            }
            let func = Object.getOwnPropertyDescriptor(ctx, funcName);
            if (NetDefine.WS_Req[funcName] != null) {
                console.log("注册加密", NetDefine.WS_Req[funcName], funcName);
                WebSocketUtil.ins.registerEncry(NetDefine.WS_Req[funcName], func.value.bind(this));
            } else if (NetDefine.WS_Resp[funcName] != null) {
                console.log("注册解密", NetDefine.WS_Resp[funcName], funcName);
                WebSocketUtil.ins.registerDecry(NetDefine.WS_Resp[funcName], func.value.bind(this));
            } else {
                LogUtil.Log("未知方法", funcName);
            }
        }
    }

    encode(data) {
        return EncryUtils.toBase64(data);
    }

    decode(data) {
        return EncryUtils.fromBase64(data);
    }
}