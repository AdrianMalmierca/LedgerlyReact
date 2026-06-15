package com.ledgerlyrn

import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp

class CategoryBadgeViewManager : SimpleViewManager<CategoryBadgeView>() {

  override fun getName() = "CategoryBadgeView"

  override fun createViewInstance(context: ThemedReactContext): CategoryBadgeView {
    return CategoryBadgeView(context)
  }

  @ReactProp(name = "category")
  fun setCategory(view: CategoryBadgeView, category: String?) {
    category?.let { view.setCategory(it) }
  }

  @ReactProp(name = "badgeColor")
  fun setBadgeColor(view: CategoryBadgeView, color: String?) {
    color?.let { view.setBadgeColor(it) }
  }
}