import BaseEncry from "../Controller/Net/BaseEncry";


export default class HallEncry extends BaseEncry {
    private static _ins: HallEncry = null;
    static get ins() {
        if (this._ins == null) {
            this._ins = new HallEncry();
        }
        return this._ins;
    }

    C_CreateRoom(msg: any) {
        msg.gameName = this.encode(msg.gameName);
        for (let conf of msg.roomConf) {
            conf.name = this.encode(conf.name);
            conf.value = this.encode(conf.value);
        }
    }

    G_ShowCreateRoom(msg: any) {
        for (let roomConf of msg) {
            roomConf.gameName = this.decode(roomConf.gameName);
            for (let commonConf of roomConf.commonConfs) {
                commonConf.name = this.decode(commonConf.name);
                for (let i in commonConf.values) {
                    commonConf.values[i] = this.decode(commonConf.values[i]);
                }
            }
            for (let i in roomConf.ruleConfs) {
                roomConf.ruleConfs[i] = this.decode(roomConf.ruleConfs[i]);
            }
        }
    }

    G_EnterRoom(msg: any) {
        msg.gameName = this.decode(msg.gameName);
        for (let conf of msg.roomConf) {
            conf.name = this.decode(conf.name);
            conf.value = this.decode(conf.value);
        }
    }
    
    G_ShowRecord(msg: any) {
        for (let record of msg.records) {
            record.gameName = this.decode(record.gameName);
            if (record.roomConf) {
                record.roomConf = this.decode(record.roomConf);
                try {
                    record.roomConf = JSON.parse(record.roomConf);
                } catch (e) {
    
                }
            }
            for (let user of record.users) {
                if (user.userName) {
                    user.userName = this.decode(user.userName);
                }
            }
        }
    }
}