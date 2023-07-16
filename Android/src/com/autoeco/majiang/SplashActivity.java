package com.autoeco.majiang;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;

import com.autoeco.majiang.R;

public class SplashActivity extends Activity {
    private Handler mHandler = new Handler();
    private Runnable mRunnable = new Runnable() {
        @Override
        public void run() {
            //跳转到登录页面
            Intent intent = new Intent(SplashActivity.this, App.class);
            startActivity(intent);
            SplashActivity.this.finish();
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.splash);
        mHandler.postDelayed(mRunnable, 3000);
    }
}