package com.ledgerlyrn

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.content.pm.PackageManager
import android.os.Build
import androidx.core.app.ActivityCompat
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

class NotificationModule(private val reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName() = "NotificationModule"

  @ReactMethod
  fun requestPermission(promise: Promise) {
    //because since Tiramisu version Android needs explicit permission
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
      val activity = reactContext.currentActivity //get the actual androis open app
      if (activity != null) {
        ActivityCompat.requestPermissions(
          activity,
          arrayOf(android.Manifest.permission.POST_NOTIFICATIONS),
          1001
        )
      }
    }
    promise.resolve(true)
  }

  @ReactMethod
  fun showNotification(title: String, body: String) {
    val manager = reactContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
    val channelId = "ledgerly_channel"

    //since android 8 all the advices need to be part of a channel
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      val channel = NotificationChannel(
        channelId,
        "Ledgerly",
        NotificationManager.IMPORTANCE_DEFAULT
      )
      manager.createNotificationChannel(channel)
    }

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
      if (ActivityCompat.checkSelfPermission(
          reactContext,
          android.Manifest.permission.POST_NOTIFICATIONS
        ) != PackageManager.PERMISSION_GRANTED
      ) return
    }

    val notification = NotificationCompat.Builder(reactContext, channelId)
      .setContentTitle(title)
      .setContentText(body)
      .setSmallIcon(android.R.drawable.ic_dialog_info)
      .setAutoCancel(true)
      .build()

    NotificationManagerCompat.from(reactContext)
      .notify(System.currentTimeMillis().toInt(), notification)
  }
}