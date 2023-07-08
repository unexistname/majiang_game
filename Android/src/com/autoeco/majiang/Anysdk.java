package com.autoeco.majiang;

import android.Manifest;
import android.annotation.SuppressLint;
import android.content.Context;
import android.location.Address;
import android.location.Geocoder;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.util.Log;

import com.autoeco.majiang.wxapi.WXApiHelper;
import com.tencent.mm.opensdk.modelmsg.SendAuth;
import com.tencent.mm.opensdk.modelpay.PayReq;

import org.cocos2dx.lib.Cocos2dxHelper;
import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.List;
import java.util.Locale;

public class Anysdk implements LocationListener {

    private static Location location;
    private static Address address;
    private static LocationManager locationManager;
    private static String APP_ID = "wx8e6ff1558f8fda34";
    private static String MCH_ID = "1638283123";

    private static Anysdk instance = null;

    private static final String TAG = "麻将sdk";

    private Anysdk() {
    }

    public static Anysdk getInstance() {
        if (instance == null) {
            instance = new Anysdk();
        }
        return instance;
    }

    public void init() {
        App.requestPermission(new String[]{Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION}, new Runnable() {
            @Override
            public void run() {
                updateLocation();
            }
        });
    }

    public static void login() {
        Log.i(TAG, "login");
        final SendAuth.Req req = new SendAuth.Req();
        req.scope = "snsapi_userinfo";
        req.state = "wechat_sdk_demo_test";
        WXApiHelper.api.sendReq(req);
    }

    public static void onLoginResult(final String code) {
        Cocos2dxHelper.runOnGLThread(new Runnable() {
            @Override
            public void run() {
                Cocos2dxJavascriptJavaBridge.evalString("cc.sdk.onLoginResp(\"" + code + "\")");
            }
        });
    }

    public static void onPayResult(final int code) {
        Cocos2dxHelper.runOnGLThread(new Runnable() {
            @Override
            public void run() {
                Cocos2dxJavascriptJavaBridge.evalString("cc.sdk.onPayResp(" + code + ")");
            }
        });
    }

    public static void wxpay(String json) {
        try {
            PayReq req = new PayReq();
            JSONObject data = new JSONObject(json);
            //构造拉起微信支付所需参数
            req.appId = WXApiHelper.APP_ID;
            req.partnerId = data.getString("mch_id");
            req.prepayId = data.getString("prepay_id");
            req.nonceStr = data.getString("nonce_str");
            req.timeStamp = data.getString("timeStamp");
            req.packageValue = data.getString("packageValue");
            req.sign = data.getString("sign");
            //提交参数，拉起微信支付
            WXApiHelper.api.sendReq(req);
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    public static float getLongitude() {
        // 获取当前纬度
        if (location != null) {
            return (float) location.getLongitude();
        }
        return -1;
    }

    public static float getLatitude() {
        // 获取当前经度
        if (location != null) {
            return (float) location.getLatitude();
        }
        return -1;
    }

    public static String getCity() {
        if (address != null) {
            // Address里面还有很多方法你们可以自行实现去尝试。比如具体省的名称、市的名称...
//             address.getAddressLine(0) + // 获取国家名称
//                    address.getAddressLine(1) + // 获取省市县(区)
//                    address.getAddressLine(2);  // 获取镇号(地址名称)
            String res = address.getAddressLine(1);
            Log.i(TAG, "城市：" + res);
            return address.getAddressLine(1);
        }
        return null;
    }

    @SuppressLint("MissingPermission")
    private void updateLocation() {
        // 获取当前位置管理器
        locationManager = (LocationManager) App.getAppContext().getSystemService(Context.LOCATION_SERVICE);
        // 启动位置请求
        // LocationManager.GPS_PROVIDER GPS定位
        // LocationManager.NETWORK_PROVIDER 网络定位
        // LocationManager.PASSIVE_PROVIDER 被动接受定位信息
        locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 60*60*1000, 0, this);
    }

    // 当位置改变时执行，除了移动设置距离为 0时
    @Override
    public void onLocationChanged(@NonNull Location l) {
        Log.i(TAG, "onLocationChanged");
        location = l;
        // 定义位置解析
        Geocoder geocoder = new Geocoder(App.getAppContext(), Locale.getDefault());
        try {
            // 获取经纬度对于的位置
            // getFromLocation(纬度, 经度, 最多获取的位置数量)
            List<Address> addresses = geocoder.getFromLocation(location.getLatitude(), location.getLongitude(), 1);
            // 得到第一个经纬度位置解析信息
            if (addresses.size() <= 0) {
                Log.i(TAG, "无法访问谷歌地图服务");
            } else {
                address = addresses.get(0);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        // 移除位置管理器
        // 需要一直获取位置信息可以去掉这个
        locationManager.removeUpdates(this);
    }

    @Override
    public void onStatusChanged(String provider, int status, Bundle extras) {

        Log.i(TAG, "onStatusChanged");
    }

    @Override
    public void onProviderEnabled(String provider) {

        Log.i(TAG, "onProviderEnabled");
    }

    @Override
    public void onProviderDisabled(String provider) {

        Log.i(TAG, "onProviderDisabled ");
    }
}
