import { GameConst } from "../Const/GameConst";
import RoomMgr from "../Room/RoomMgr";

export default class GameUtil {
    static clearChildren(node: cc.Node) {
        for (var i = node.children.length - 1; i >= 0; --i) {
            node.children[i].parent = null;
        }
    }

    static deepClone( obj: any ) {
        if( obj === null ) return null;

        let o;
        if ( typeof obj == "object" ) {
            o = obj.constructor === Array ? [] : {};
            for ( let i in obj ) {
                if( obj.hasOwnProperty( i ) ) {
                    // @ts-ignore
                    o[ i ] = typeof obj[ i ] === "object" ? this.deepClone( obj[ i ] ) : obj[ i ];
                }
            }
        } else {
            o = obj;
        }
        return o;
    }

    static swap(arr: any, index: number, anotherIndex: number) {
        let tmp = arr[index];
        arr[index] = arr[anotherIndex];
        arr[anotherIndex] = tmp;
    }

    static reverseRemove(arr: any[], data: any) {
        for (let i = arr.length - 1; i >= 0; --i) {
            if (arr[i] == data) {
                arr.splice(i, 1);
                return;
            }
        }
    }

    static isMahjongGame() {
        let gameType = RoomMgr.ins.getGameType();
        switch (gameType) {
            case GameConst.GameType.FU_DING:
            case GameConst.GameType.QUE_SHENG:
                return true;
            default:
                return false;
        }
    }

    static isPokerGame() {
        return !this.isMahjongGame();
    }

    static isBettingGame() {
        let gameType = RoomMgr.ins.getGameType();
        switch (gameType) {
            case GameConst.GameType.DE_ZHOU:
            case GameConst.GameType.DIAO_XIE:
            case GameConst.GameType.ZHA_JIN_HUA:
                return true;
            default:
                return false;
        }
    }

    static cutString(str: string, length: number){
        if (str == null) return;
        var ret = "";
        var len = 0;  
        for (var i=0; i<str.length; i++) {  
            if (str.charCodeAt(i)>127 || str.charCodeAt(i)==94) {  
                len += 2;
            } else {  
                len ++;  
            }
            if(len >= length){
                ret += "..";
                break;
            }
            ret += str[i];
        }  
        return ret;
    }

    static isRemoteUrl(path: string) {
        return path.indexOf("http") == 0;
    }

    static isBelongTo(father, son) {
        let node = son.parent;
        while (node != null) {
            if (node == father) {
                return true;
            }
            node = node.parent;
        }
        return false;
    }

    static getStandDate(date) {
        return this.dateFormat("yyyy MM dd hh:mm:ss", date);
    }
    
    static dateFormat( format , date ) {
        if(date) {
            date = parseInt(date);
            date = new Date(date);
        }
        else {
            date = new Date();
        }
        format=format.replace(/y+/,"" + date.getFullYear());
        format=format.replace(/M+/,date.getMonth()>=9?""+(date.getMonth()+1):"0"+(date.getMonth()+1));
        format=format.replace(/d+/,date.getDate()>=10?""+date.getDate():"0"+date.getDate());
        format=format.replace(/h+/,date.getHours()>=10?""+date.getHours():"0"+date.getHours());
        format=format.replace(/m+/,date.getMinutes()>=10?""+date.getMinutes():"0"+date.getMinutes());
        format=format.replace(/s+/,date.getSeconds()>=10?""+date.getSeconds():"0"+date.getSeconds());
        format=format.replace(/q+/,Math.floor(date.getMonth()/3 + 1));
        format=format.replace(/S+/,date.getMilliseconds()>=10?""+date.getMilliseconds():"0"+date.getMilliseconds());
        
        return format;
    }

}