package com.ledgerlyrn

import android.content.Context
import android.graphics.Canvas
import android.graphics.Paint
import android.graphics.RectF
import android.view.View
import androidx.core.content.ContextCompat

class ExpenseChartView(context: Context) : View(context) {

  private var data: Map<String, Float> = emptyMap()
  private val paint = Paint(Paint.ANTI_ALIAS_FLAG) //define how to draw something
  private val textPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
    textSize = 28f
    color = android.graphics.Color.parseColor("#8E8E93")
    textAlign = Paint.Align.CENTER
  }
  private val valuePaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
    textSize = 24f
    color = android.graphics.Color.parseColor("#3C3C43")
    textAlign = Paint.Align.CENTER
  }

  private val colors = listOf(
    android.graphics.Color.parseColor("#FF9500"),
    android.graphics.Color.parseColor("#007AFF"),
    android.graphics.Color.parseColor("#FF3B30"),
    android.graphics.Color.parseColor("#8E8E93"),
  )

  fun setData(newData: Map<String, Float>) {
    data = newData
    invalidate() //the view has changed so draw it again
  }

  override fun onDraw(canvas: Canvas) {
    super.onDraw(canvas)
    if (data.isEmpty()) return

    val entries = data.entries.toList()
    val maxValue = entries.maxOfOrNull { it.value } ?: return
    if (maxValue == 0f) return

    val count = entries.size
    val availableWidth = width - 64f
    val barWidth = availableWidth / count * 0.6f
    val spacing = availableWidth / count
    val maxBarHeight = height - 100f
    val bottomY = height - 50f

    entries.forEachIndexed { index, entry ->
      val barHeight = (entry.value / maxValue) * maxBarHeight
      val centerX = 32f + spacing * index + spacing / 2
      val left = centerX - barWidth / 2
      val top = bottomY - barHeight
      val right = centerX + barWidth / 2

      paint.color = colors[index % colors.size]
      val rect = RectF(left, top, right, bottomY) //rectangle of a bar 
      canvas.drawRoundRect(rect, 12f, 12f, paint)

      //Label
      canvas.drawText(entry.key, centerX, bottomY + 30f, textPaint)

      //Value
      canvas.drawText("%.0f€".format(entry.value), centerX, top - 10f, valuePaint)
    }
  }
}