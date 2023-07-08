package com.autoeco.majiang.wxapi;

import android.app.Activity;
import android.os.Bundle;
import android.util.Log;

import com.autoeco.majiang.Anysdk;
import com.tencent.mm.opensdk.modelbase.BaseReq;
import com.tencent.mm.opensdk.modelbase.BaseResp;
import com.tencent.mm.opensdk.modelmsg.SendAuth;
import com.tencent.mm.opensdk.openapi.IWXAPIEventHandler;

public class WXEntryActivity extends Activity implements IWXAPIEventHandler {

    private static final String TAG = "麻将sdk";

    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        WXApiHelper.api.handleIntent(getIntent(), this);
    }

    @Override
    public void onReq(BaseReq baseReq) {

    }

    @Override
    public void onResp(BaseResp resp) {
        switch (resp.errCode) {
            case BaseResp.ErrCode.ERR_OK:
                Log.i(TAG,"onResp OK");

                if(resp instanceof SendAuth.Resp){
                    SendAuth.Resp newResp = (SendAuth.Resp) resp;
                    //获取微信传回的code
                    String code = newResp.code;
                    Log.i(TAG,"onResp code = "+code);
                    Anysdk.onLoginResult(code);
                }

                break;
            case BaseResp.ErrCode.ERR_USER_CANCEL:
                Log.i(TAG,"onResp ERR_USER_CANCEL ");
                //发送取消
                break;
            case BaseResp.ErrCode.ERR_AUTH_DENIED:
                Log.i(TAG,"onResp ERR_AUTH_DENIED");
                //发送被拒绝
                break;
            default:
                Log.i(TAG,"onResp default errCode " + resp.errCode);
                //发送返回
                break;
        }
        finish();
    }
}
