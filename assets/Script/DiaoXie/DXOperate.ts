

export default class DXOperate {
    static WAIVE = 1 << 0;
    static EAT = 1 << 1;
    static TOUCH = 1 << 2;
    static BELT = 1 << 3;
    static BLIND_EAT = 1 << 4;
    static REVERSE_BELT = 1 << 5;
    static NO_BELT = 1 << 6;
}

let dxOperateName = {};
dxOperateName[DXOperate.WAIVE] = "弃";
dxOperateName[DXOperate.EAT] = "吃";
dxOperateName[DXOperate.TOUCH] = "碰";
dxOperateName[DXOperate.BELT] = "带";
dxOperateName[DXOperate.BLIND_EAT] = "闷吃";
dxOperateName[DXOperate.REVERSE_BELT] = "反带";
dxOperateName[DXOperate.NO_BELT] = "不带";

export let DXOperateName = dxOperateName;