package com.unigate.presentation.history

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.IntrinsicSize
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.unigate.presentation.history.model.AccessLogUiModel

@Composable
fun HistoryCard(item: AccessLogUiModel) {
    val isGranted = item.status.lowercase() == "granted"
    val indicatorColor = if (isGranted) Color(0xFF36C97D) else Color(0xFFF85959)

    Surface(
        modifier = Modifier
            .fillMaxWidth()
            .clip(MaterialTheme.shapes.medium),
        shadowElevation = 2.dp,
        color = Color.White,
    ) {
        Row(
            modifier = Modifier.height(IntrinsicSize.Min)
        ) {
            Box(
                Modifier
                    .width(7.dp)
                    .fillMaxHeight()
                    .clip(
                        MaterialTheme.shapes.medium.copy(
                            topStart = MaterialTheme.shapes.medium.topStart,
                            bottomStart = MaterialTheme.shapes.medium.bottomStart
                        )
                    )
                    .background(indicatorColor)
            )

            Row(
                modifier = Modifier
                    .padding(vertical = 12.dp, horizontal = 16.dp)
                    .fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(
                    modifier = Modifier.weight(1f)
                ) {
                    Text(
                        text = item.accessPoint,
                        style = MaterialTheme.typography.titleMedium
                    )
                    Spacer(Modifier.height(2.dp))
                    Text(
                        text = item.date.toString(),
                        color = Color.Gray,
                        style = MaterialTheme.typography.bodyMedium
                    )
                    item.reason?.let {
                        Spacer(Modifier.height(2.dp))
                        Text(
                            text = it,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            style = MaterialTheme.typography.bodySmall
                        )
                    }
                }
                Text(
                    text = if (isGranted) "Granted" else "Denied",
                    color = indicatorColor,
                    style = MaterialTheme.typography.bodyMedium
                )
            }
        }
    }
}