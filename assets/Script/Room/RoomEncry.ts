import BaseEncry from "../Controller/Net/BaseEncry";


export default class RoomEncry extends BaseEncry {
    private static _ins: RoomEncry = null;
    static get ins() {
        if (this._ins == null) {
            this._ins = new RoomEncry();
        }
        return this._ins;
    }

    G_PushRoomInfo(msg: any) {
        msg.gameName = this.decode(msg.gameName);
        for (let gamberId in msg.gambers) {
            let gamber = msg.gambers[gamberId];
            gamber.userName = this.decode(gamber.userName);
        }
    }

    G_GameOver(msg: any) {
        msg.ownerName = this.decode(msg.ownerName);
        let roomConf: any = {};
        for (let name in msg.roomConf) {
            let value = this.decode(msg.roomConf[name]);
            if (value == "true" || value == "false") {
                value = value == "true";
            } else if (!isNaN(Number(value))) {
                value = Number(value);
            }
            roomConf[this.decode(name)] = value;
        }
        msg.roomConf = roomConf;
        for (let userId in msg.records) {
            let record = msg.records[userId];
            record.userName = this.decode(record.userName);
        }
    }

    G_GameSettle(msg: any) {
        for (let userId in msg.settles) {
            let data = msg.settles[userId];
            if (data.winTypes) {
                let winTypes = [];
                for (let winType of data.winTypes) {
                    winTypes.push(this.decode(winType));
                }
                data.winTypes = winTypes;
            }
        }
    }

    G_AddGamber(msg: any) {
        msg.userName = this.decode(msg.userName);
    }

    G_AddWatcher(msg: any) {
        msg.userName = this.decode(msg.userName);
    }

    G_WatcherToGamber(msg: any) {
        msg.userName = this.decode(msg.userName);
    }

    C_Chat(msg: any) {
        msg.content = this.encode(msg.content);
    }

    G_Chat(msg: any) {
        msg.content = this.decode(msg.content);
    }
}