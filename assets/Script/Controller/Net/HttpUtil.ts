import { ErrorCode } from "../../ErrorCode";
import { Singleton } from "../../Util/Singleton";
import LogUtil from "../../Util/LogUtil";
import UIMgr from "../../BaseUI/UIMgr";


@Singleton
export default class HttpUtil {

    static defaultUrl: string = "";

    static setDefaultUrl(url: string) {
        this.defaultUrl = url;
    }

    static httpSend(path: string, data: Object, callback: Function, extraUrl?: string) {
        console.log("Http Send", path, data, extraUrl);
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.timeout = 10000;
        var str = "?";
        for (var k in data) {
            if (str != "?") {
                str += "&";
            }
            str += k + "=" + data[k];
        }
        if (extraUrl == null) {
            extraUrl = this.defaultUrl;
        }
        let requestURL = extraUrl + path + encodeURI(str);
        if (!requestURL.startsWith("http")) {
            requestURL = "http://" + requestURL;
        }

        LogUtil.Log(1, "RequestURL:" + requestURL);

        xhr.open("GET", requestURL, true);
        if (cc.sys.isNative) {
            // @ts-ignore
            xhr.setRequestHeader("Accept-Encoding", "gzip,deflate", "text/html;charset=UTF-8");
        }

        let handler = (ret: any) => {
            if (ret.errcode) {
                UIMgr.showError(ret.errcode);
            } else {
                callback && callback(ret);
            }
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                LogUtil.Log("http res(" + xhr.responseText.length + "):" + xhr.responseText);
                try {
                    var ret = JSON.parse(xhr.responseText);
                } catch (e) {
                    LogUtil.Error("err:" + e);
                    handler({ errcode: ErrorCode.JSON_PARSE_ERROR });
                    return
                }
                handler(ret);
            }
        };
        xhr.ontimeout = function () {
            LogUtil.Warn("http timeout", requestURL);
            handler({ errcode: ErrorCode.HTTP_REQUEST_TIMEOUT });
        };
        xhr.onerror = function () {
            LogUtil.Error("http error", requestURL);
            handler({ errcode: ErrorCode.HTTP_REQUEST_ERROR });
        };
        xhr.send();
        return xhr;
    }
}