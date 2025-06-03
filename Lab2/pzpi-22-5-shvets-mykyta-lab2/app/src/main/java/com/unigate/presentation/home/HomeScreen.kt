package com.unigate.presentation.home

import android.os.Build
import androidx.annotation.RequiresApi
import androidx.compose.foundation.background
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CalendarToday
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.QrCode
import androidx.compose.material.icons.filled.Rule
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import coil.compose.rememberAsyncImagePainter
import com.unigate.presentation.home.components.InfoCard
import com.unigate.presentation.home.components.LineChart

@Composable
fun RecentVisitRow(item: RecentVisit, modifier: Modifier = Modifier) {
    Row(
        modifier = modifier
            .padding(vertical = 8.dp)
            .fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(item.accessPoint, style = MaterialTheme.typography.bodyLarge)
        Text(item.date.toString(), style = MaterialTheme.typography.bodySmall)
    }
}

@RequiresApi(Build.VERSION_CODES.O)
@Composable
fun HomeScreen(viewModel: HomeViewModel = hiltViewModel()) {
    val state by viewModel.uiState.collectAsState()
    var showQr by remember { mutableStateOf(false) }

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(
                onClick = { showQr = true },
                containerColor = MaterialTheme.colorScheme.primary,
                contentColor = MaterialTheme.colorScheme.onPrimary
            ) {
                Icon(Icons.Default.QrCode, contentDescription = "Show QR")
            }
        },
        containerColor = Color(0xFFF6F9FC)
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            when {
                state.isLoading -> Box(
                    Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator()
                }
                state.error != null -> Box(
                    Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    Text(state.error!!, color = MaterialTheme.colorScheme.error)
                }
                else -> {
                    LazyColumn(
                        Modifier
                            .fillMaxSize()
                            .padding(horizontal = 24.dp)
                            .padding(bottom = 24.dp),
                        verticalArrangement = Arrangement.spacedBy(24.dp)
                    ) {
                        item {
                            Text(
                                text = "Welcome, ${state.firstName}!",
                                style = MaterialTheme.typography.headlineLarge,
                                modifier = Modifier.padding(top = 2.dp, bottom = 12.dp)
                            )
                        }

                        item {
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(16.dp)
                            ) {
                                InfoCard(
                                    icon = Icons.Default.Lock,
                                    title = "Access Level",
                                    value = state.accessLevel,
                                    modifier = Modifier.weight(1f)
                                )
                                InfoCard(
                                    icon = Icons.Default.CalendarToday,
                                    title = "Visits (7d)",
                                    value = state.visits7DaysCount.toString(),
                                    modifier = Modifier.weight(1f)
                                )
                                InfoCard(
                                    icon = Icons.Default.Rule,
                                    title = "Access Rules",
                                    value = state.accessRulesCount.toString(),
                                    modifier = Modifier.weight(1f)
                                )
                            }
                        }

                        item {
                            Card(
                                modifier = Modifier
                                    .fillMaxWidth(),
                                colors = CardDefaults.cardColors(containerColor = Color.White),
                                elevation = CardDefaults.cardElevation(2.dp)
                            ) {
                                Column(Modifier.padding(16.dp)) {
                                    Text("Visits (7 days)", style = MaterialTheme.typography.titleMedium)
                                    Spacer(Modifier.height(12.dp))
                                    LineChart(
                                        data = state.visitsByDate.map { it.second },
                                        modifier = Modifier.fillMaxWidth()
                                    )
                                }
                            }
                        }

                        item {
                            Card(
                                modifier = Modifier
                                    .fillMaxWidth(),
                                colors = CardDefaults.cardColors(containerColor = Color.White),
                                elevation = CardDefaults.cardElevation(2.dp)
                            ) {
                                Column(
                                    Modifier.padding(16.dp)
                                ) {
                                    Text(
                                        text = "Recent Visits",
                                        style = MaterialTheme.typography.titleMedium,
                                        modifier = Modifier.padding(bottom = 8.dp)
                                    )
                                    if (state.recentVisits.isEmpty()) {
                                        Text("No recent visits", color = Color.Gray)
                                    } else {
                                        state.recentVisits.forEach { visit ->
                                            RecentVisitRow(
                                                item = visit,
                                                modifier = Modifier.fillMaxWidth()
                                            )
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            if (showQr) {
                QrCodeDialog(onDismiss = { showQr = false })
            }
        }
    }
}


@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun QrCodeDialog(
    onDismiss: () -> Unit,
    viewModel: QrCodeViewModel = hiltViewModel()
) {
    val bitmap by viewModel.qrBitmap.collectAsState()

    LaunchedEffect(Unit) {
        viewModel.loadQrCode()
    }

    ModalBottomSheet(
        onDismissRequest = onDismiss,
        containerColor = Color(0xFFF6F9FC),
        tonalElevation = 8.dp,
        shape = RoundedCornerShape(topStart = 28.dp, topEnd = 28.dp)
    ) {
        Column(
            Modifier
                .fillMaxWidth()
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text("Your Access QR", style = MaterialTheme.typography.titleMedium, color = Color(0xFF7C4DFF))
            Spacer(Modifier.height(24.dp))

            if (bitmap == null) {
                CircularProgressIndicator()
            } else {
                Image(
                    bitmap = bitmap!!.asImageBitmap(),
                    contentDescription = "QR Code",
                    modifier = Modifier
                        .size(200.dp)
                        .clip(RoundedCornerShape(18.dp))
                        .background(Color.White)
                )
            }

            Spacer(Modifier.height(24.dp))
            Text(
                "Show this QR code to the scanner to enter the area.",
                style = MaterialTheme.typography.bodySmall,
                color = Color(0xFF7C4DFF)
            )
            Spacer(Modifier.height(12.dp))
            Button(
                onClick = onDismiss,
                modifier = Modifier
                    .fillMaxWidth(0.6f)
            ) {
                Text("Close")
            }
        }
    }
}
