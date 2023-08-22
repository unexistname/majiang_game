
export default class LoginModel {  

    private static _ins: LoginModel = null;
    public static get ins() {
        if (this._ins == null) {
            this._ins = new LoginModel();
        }
        return this._ins;
    }
    public static release() {
        delete this._ins;
        this._ins = null;
    }

    recommend: number;
    servers: any[] = [];
    selectServerIndex: number;
    selectServerToken: string;
    debug: boolean = false;

    getRecommendServer() {
        for (let server of this.servers) {
            if (server.index == this.recommend) {
                return server;
            }
        }
        return this.servers[0];
    }
}