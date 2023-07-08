package com.autoeco.majiang;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.support.v4.app.ActivityCompat;
import android.util.Log;

import com.autoeco.majiang.wxapi.WXApiHelper;

import org.cocos2dx.javascript.AppActivity;

import java.util.ArrayList;
import java.util.List;

public class App extends AppActivity {
    @SuppressLint("StaticFieldLeak")
    private static Context context;

    private static Runnable task;

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        App.context = this;
        Log.i("麻将SDK", "初始化APP类");
        Anysdk.getInstance().init();
        WXApiHelper.init(this);
    }

    public static Context getAppContext() {
        return App.context;
    }

    public static void requestPermission(String permission, Runnable handler) {
        requestPermission(new String[] {permission}, handler);
    }

    public static void requestPermission(String[] permissions, Runnable handler) {
        List<String> needGrantPermissions = new ArrayList<>();
        for (String permission : permissions) {
            if (ActivityCompat.checkSelfPermission(App.getAppContext(), permission) != PackageManager.PERMISSION_GRANTED) {
                // 申请权限
                needGrantPermissions.add(permission);
            }
        }
        if (needGrantPermissions.size() > 0) {
            task = handler;
            ActivityCompat.requestPermissions((Activity) App.getAppContext(), permissions, 100);
        } else {
            handler.run();
        }
    }

    public static boolean hasPermission(String permission) {
        return ActivityCompat.checkSelfPermission(App.getAppContext(), permission) != PackageManager.PERMISSION_GRANTED;
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        for (int result : grantResults) {
            if (result != PackageManager.PERMISSION_GRANTED) {
                task = null;
                return;
            }
        }

        task.run();
        task = null;
    }
}
