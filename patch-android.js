// Runs after "cap sync": adds a small Android plugin that saves files straight into Downloads.
const fs = require('fs'), path = require('path');
const platform = process.env.CAPACITOR_PLATFORM_NAME;
if (platform && platform !== 'android') process.exit(0);
const dir = path.join('android', 'app', 'src', 'main', 'java', 'com', 'romcorrupter', 'app');
if (!fs.existsSync(dir)) { console.log('patch-android: no android project yet, skipping'); process.exit(0); }
fs.writeFileSync(path.join(dir, 'SaveFilePlugin.java'), `package com.romcorrupter.app;

import android.content.ContentResolver;
import android.content.ContentValues;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Base64;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;

@CapacitorPlugin(name = "SaveFile")
public class SaveFilePlugin extends Plugin {
  @PluginMethod
  public void save(PluginCall call) {
    String name = call.getString("name");
    String data = call.getString("data");
    String mime = call.getString("mime", "application/octet-stream");
    if (name == null || data == null) { call.reject("missing name or data"); return; }
    try {
      byte[] bytes = Base64.decode(data, Base64.DEFAULT);
      if (Build.VERSION.SDK_INT >= 29) {
        ContentValues v = new ContentValues();
        v.put(MediaStore.MediaColumns.DISPLAY_NAME, name);
        v.put(MediaStore.MediaColumns.MIME_TYPE, mime);
        v.put(MediaStore.MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS);
        ContentResolver r = getContext().getContentResolver();
        Uri uri = r.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, v);
        if (uri == null) throw new IOException("Could not create file in Downloads");
        try (OutputStream os = r.openOutputStream(uri)) { os.write(bytes); }
      } else {
        File dir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS);
        dir.mkdirs();
        try (FileOutputStream os = new FileOutputStream(new File(dir, name))) { os.write(bytes); }
      }
      JSObject ret = new JSObject();
      ret.put("path", "Downloads/" + name);
      call.resolve(ret);
    } catch (Exception e) {
      call.reject(String.valueOf(e.getMessage()));
    }
  }
}
`);
fs.writeFileSync(path.join(dir, 'MainActivity.java'), `package com.romcorrupter.app;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    registerPlugin(SaveFilePlugin.class);
    super.onCreate(savedInstanceState);
  }
}
`);
console.log('patch-android: SaveFile plugin installed');
