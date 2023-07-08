package com.autoeco.majiang.wxapi;

import android.content.Context;

import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;

public class WXApiHelper {
    public static String APP_ID = "wx02b8313157685a8f";
    public static String MCH_ID = "1638283123";

    public static IWXAPI api;

    public static void init(Context context) {
//        api = WXAPIFactory.createWXAPI(context, APP_ID);
        api = WXAPIFactory.createWXAPI(context, APP_ID, true);
        api.registerApp(APP_ID);

        final IWXAPI msgApi = WXAPIFactory.createWXAPI(context, null);
        // 将该app注册到微信
        msgApi.registerApp(APP_ID);
    }
}
