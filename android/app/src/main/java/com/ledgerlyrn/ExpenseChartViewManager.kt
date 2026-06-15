package com.ledgerlyrn

import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.bridge.ReadableMap

class ExpenseChartViewManager : SimpleViewManager<ExpenseChartView>() {

  override fun getName() = "ExpenseChartView" //name for react

  override fun createViewInstance(context: ThemedReactContext): ExpenseChartView {
    return ExpenseChartView(context)
  }

  @ReactProp(name = "data") //if someone gives a prop called data, call this function
  fun setData(view: ExpenseChartView, data: ReadableMap?) {
    if (data == null) return
    val map = mutableMapOf<String, Float>()
    val iterator = data.keySetIterator()
    while (iterator.hasNextKey()) {
      val key = iterator.nextKey()
      map[key] = data.getDouble(key).toFloat() //transform into Float cause we neeed it for the map
    }
    view.setData(map)
  }
}