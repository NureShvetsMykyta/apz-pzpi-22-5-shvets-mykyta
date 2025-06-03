package com.unigate.presentation.accessrules

import android.os.Build
import androidx.annotation.RequiresApi
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Cancel
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.unigate.presentation.accessrules.model.AccessRuleUiModel
import java.time.format.DateTimeFormatter

@RequiresApi(Build.VERSION_CODES.O)
@Composable
fun AccessRulesScreen(
    viewModel: AccessRulesViewModel = hiltViewModel()
) {
    val state by viewModel.state.collectAsState()
    val timeFormatter = remember { DateTimeFormatter.ofPattern("HH:mm") }

    Box(
        Modifier
            .fillMaxSize()
            .background(Color(0xFFF6F9FC))
    ) {
        when {
            state.isLoading -> Box(
                Modifier.fillMaxSize(),
                contentAlignment = Alignment.Center
            ) { CircularProgressIndicator() }

            state.error != null -> Box(
                Modifier.fillMaxSize(),
                contentAlignment = Alignment.Center
            ) {
                Text(state.error!!, color = MaterialTheme.colorScheme.error)
            }

            state.items.isEmpty() -> Box(
                Modifier.fillMaxSize(),
                contentAlignment = Alignment.Center
            ) {
                Text("No access rules found", color = Color.Gray)
            }

            else -> {
                LazyColumn(
                    Modifier
                        .fillMaxSize()
                        .padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    item {
                        Text(
                            "Access Rules",
                            style = MaterialTheme.typography.headlineSmall,
                            modifier = Modifier.padding(bottom = 8.dp)
                        )
                    }
                    items(state.items) { rule ->
                        AccessRuleCard(rule, timeFormatter)
                    }
                }
            }
        }
    }
}

@Composable
fun AccessRuleCard(
    rule: AccessRuleUiModel,
    timeFormatter: DateTimeFormatter
) {
    val statusColor = if (rule.access) Color(0xFF36B37E) else Color(0xFFEF3B4C)
    val statusText = if (rule.access) "Granted" else "Denied"
    val statusIcon = if (rule.access) Icons.Default.CheckCircle else Icons.Default.Cancel

    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(2.dp)
    ) {
        Row(
            Modifier
                .padding(16.dp)
                .fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                Modifier
                    .size(44.dp)
                    .clip(MaterialTheme.shapes.medium)
                    .background(statusColor.copy(alpha = 0.08f)),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = statusIcon,
                    contentDescription = null,
                    tint = statusColor,
                    modifier = Modifier.size(28.dp)
                )
            }
            Spacer(Modifier.width(16.dp))
            Column(Modifier.weight(1f)) {
                Text(rule.zone, style = MaterialTheme.typography.titleMedium)
                Text(
                    text = buildString {
                        if (rule.startTime != null && rule.endTime != null) {
                            append("${rule.startTime.format(timeFormatter)} - ${rule.endTime.format(timeFormatter)}")
                        } else {
                            append("Any time")
                        }
                    },
                    style = MaterialTheme.typography.bodyMedium,
                    color = Color.Gray
                )
            }
            Spacer(Modifier.width(16.dp))
            Text(
                text = statusText,
                color = statusColor,
                style = MaterialTheme.typography.labelLarge
            )
        }
    }
}
