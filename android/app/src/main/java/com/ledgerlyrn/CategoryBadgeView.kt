package com.ledgerlyrn

import android.content.Context
import android.graphics.Color
import android.graphics.drawable.GradientDrawable
import android.view.Gravity
import android.widget.TextView
import android.widget.FrameLayout

class CategoryBadgeView(context: Context) : FrameLayout(context) {

  private val label = TextView(context).apply {
    gravity = Gravity.CENTER
    textSize = 13f
    setTextColor(Color.WHITE)
    setPadding(24, 8, 24, 8)
  }

  init {
    addView(label)
    val bg = GradientDrawable().apply {
      cornerRadius = 24f
      setColor(Color.GRAY)
    }
    background = bg
  }

  fun setCategory(category: String) {
    label.text = category
  }

  fun setBadgeColor(hex: String) {
    try {
      val bg = GradientDrawable().apply {
        cornerRadius = 24f
        setColor(Color.parseColor(hex))
      }
      background = bg
    } catch (e: Exception) {
      //keep gray
    }
  }
}