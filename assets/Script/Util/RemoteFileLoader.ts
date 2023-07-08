import { Singleton } from "./Singleton";
import LogUtil from "./LogUtil";

// @Singleton
export default class RemoteFileLoader {

    private static _ins: RemoteFileLoader;
    static get ins() {
        if (this._ins == null) {
            this._ins = new RemoteFileLoader();
        }
        return this._ins;
    }

    loadImage(url: string, callback?: Function) {
        cc.loader.load(url, (err: any, tex: cc.Texture2D) => {
            if (tex && tex.height != 0) {
                let spriteFrame = new cc.SpriteFrame(tex);
                callback(spriteFrame);
            } else {
                callback(null);
            }
        });
    }

    loadRemoteImage(url: string, callback?: Function) {
        if (url == null || url == "" || window.jsb == null) {
            callback(null);
            return;
        }

        let dirpath = jsb.fileUtils.getWritablePath() + 'customRes/';
        let formatedFilename = this.convertPathRemoveDirectory(url);
        if (formatedFilename == null || formatedFilename == "") {
            callback(null);
            return;
        }
        let filepath = dirpath + formatedFilename;
        if (!this.isValidCommonSuffix(this.getSuffixFromPath(filepath))) {
            // 防止有的网址不带图片后缀
            filepath += '.png';
        }

        LogUtil.Log("图片路径", filepath);
        if (jsb.fileUtils.isFileExist(filepath)) {
            // 图片存在，直接加载
            this.loadImage(filepath, callback);
            return;
        }

        let self = this;
        let saveFile = function (data: any) {
            if (data) {
                LogUtil.Log("图片保存路径", dirpath);
                if (!jsb.fileUtils.isDirectoryExist(dirpath)) {
                    // 目录不存在，创建
                    jsb.fileUtils.createDirectory(dirpath);
                }

                // @ts-ignore
                if(jsb.fileUtils.writeDataToFile(  new Uint8Array(data) , filepath) ){
                    // 成功将下载下来的图片写入本地
                    LogUtil.Log('Remote write file success.');
                    self.loadImage(filepath, callback);
                }else{
                    LogUtil.Log('Remote write file failed.');
                    LogUtil.Log("data.size()=", data.size());
                    callback(null);
                }
            } else {
                LogUtil.Log("下载数据为空");
                callback(null);
            }
        };

        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    saveFile(xhr.response);
                } else {
                    saveFile(null);
                }
            } else if (xhr.readyState === 1) {
                xhr.send();
            } else {
                LogUtil.Log("xhr状态", xhr.readyState);
            }
        };

        LogUtil.Log("打开网址", url);
        //responseType一定要在外面设置
        xhr.responseType = 'arraybuffer';
        xhr.open("GET", url, true);
        xhr.send();
    }

    // 将网址中的"/"转换成"__"
    convertPathRemoveDirectory(path: string) {
        if (path == null) {
            return "";
        }

        let len = path.length;
        path = path.substr(8, len);
        path = path.replace(/\//g, '__');
        return path;
    }

    getSuffixFromPath(path: string) {
        let index = path.lastIndexOf('.');
        if (index < 0) {
            return "";
        }

        return path.substr(index);
    }

    isValidCommonSuffix(s?: string) {
        if (typeof s !== "string" || s == "" || s == "unknown") {
            return false;
        }

        if (s.length > 4) {
            return false;
        }

        let index = s.indexOf('.');
        if (index == -1) {
            return false;
        }

        return true;
    }
}
