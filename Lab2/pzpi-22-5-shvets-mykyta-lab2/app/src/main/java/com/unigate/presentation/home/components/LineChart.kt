package com.unigate.presentation.home.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.unit.dp

@Composable
fun LineChart(
    data: List<Int>,
    modifier: Modifier = Modifier
) {
    if (data.isEmpty()) return

    val lineColor = MaterialTheme.colorScheme.primary
    val pointBackgroundColor = Color.White
    val pointColor = lineColor

    Canvas(
        modifier = modifier
            .height(150.dp)
            .fillMaxWidth()
    ) {
        val padding = 16f
        val w = size.width  - padding * 2
        val h = size.height - padding * 2

        val maxY = (data.maxOrNull() ?: 0)
            .coerceAtLeast(1)
            .toFloat()

        val points = data.mapIndexed { i, v ->
            val x = padding + w * i / (data.size - 1).toFloat()
            val y = padding + h * (1f - (v.toFloat() / maxY))
            Offset(x, y)
        }

        val path = Path().apply {
            moveTo(points.first().x, points.first().y)
            points.drop(1).forEach { lineTo(it.x, it.y) }
        }

        drawPath(
            path = path,
            color = lineColor,
            style = Stroke(width = 3f)
        )

        points.forEach { pt ->
            drawCircle(
                color  = pointBackgroundColor,
                radius = 6f,
                center = pt
            )
            drawCircle(
                color  = pointColor,
                radius = 4f,
                center = pt
            )
        }
    }
}
