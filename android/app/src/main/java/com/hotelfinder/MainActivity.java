package com.hotelfinder;

import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.widget.LinearLayout;

import androidx.core.content.ContextCompat;

import com.reactnativenavigation.NavigationActivity;

public class MainActivity extends NavigationActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(this.createSplashLayout());
    }

    public LinearLayout createSplashLayout() {
        LinearLayout splash = new LinearLayout(this);
        Drawable launch_screen_bitmap = ContextCompat.getDrawable(getApplicationContext(), R.drawable.splash_background);
        splash.setBackground(launch_screen_bitmap);

        return splash;
    }
  
}
