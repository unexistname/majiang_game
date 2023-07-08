package com.autoeco.majiang.wxapi;

import android.app.Activity;
import android.os.Bundle;
import android.util.Log;

import com.autoeco.majiang.Anysdk;
import com.tencent.mm.opensdk.constants.ConstantsAPI;
import com.tencent.mm.opensdk.modelbase.BaseReq;
import com.tencent.mm.opensdk.modelbase.BaseResp;
import com.tencent.mm.opensdk.openapi.IWXAPIEventHandler;

public class WXPayEntryActivity extends Activity implements IWXAPIEventHandler {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        WXApiHelper.api.handleIntent(getIntent(), this);
    }

    @Override
    public void onResp(BaseResp resp) {
        if (resp.getType() == ConstantsAPI.COMMAND_PAY_BY_WX) {
            int code = resp.errCode;
            switch (code) {
                case 0:
                    Log.i("WXPayEntryActivity", "支付成功");
                    Anysdk.onPayResult(code);
                    break;
                case -1:
                    Log.i("WXPayEntryActivity", "支付失败");
                    break;
                case -2:
                    Log.i("WXPayEntryActivity", "支付取消");
                    break;
                default:
                    Log.i("WXPayEntryActivity", "支付失败");
                    setResult(RESULT_OK);
                    break;
            }
            finish();
        }
    }

    @Override
    public void onReq(BaseReq baseReq) {

    }
}
