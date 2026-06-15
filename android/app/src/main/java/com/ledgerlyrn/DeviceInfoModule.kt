package com.ledgerlyrn

import android.os.Build
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

class DeviceInfoModule(private val reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName() = "DeviceInfoModule"

  @ReactMethod
  fun getDeviceName(promise: Promise) {
    promise.resolve("${Build.MANUFACTURER} ${Build.MODEL}")
  }

  @ReactMethod
  fun getSystemVersion(promise: Promise) {
    promise.resolve("Android ${Build.VERSION.RELEASE}")
  }

  @ReactMethod
  fun getAppVersion(promise: Promise) {
    try {
      //packageManager knows information about the apps installed
      val pInfo = reactContext.packageManager.getPackageInfo(reactContext.packageName, 0)
      promise.resolve(pInfo.versionName)
    } catch (e: Exception) {
      promise.resolve("1.0.0")
    }
  }
}