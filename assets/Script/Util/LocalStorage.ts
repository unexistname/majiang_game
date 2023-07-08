
export default class LocalStorage {

    static setItem(name: string, value: any) {
        cc.sys.localStorage.setItem(name, value);
    }

    static getItem(name: string, defaultVal?: any) {
        return cc.sys.localStorage.getItem(name, defaultVal);
    }

}