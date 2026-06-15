package com.ledgerlyrn

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class LedgerlyPackage : ReactPackage {

  override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
    return listOf(
      NotificationModule(reactContext),
      DeviceInfoModule(reactContext),
    )
  }

    //native view and props, * cause we dont care the type exactly, just any ViewManager
  override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
    return listOf(
      ExpenseChartViewManager(),
      CategoryBadgeViewManager(),
    )
  }
}