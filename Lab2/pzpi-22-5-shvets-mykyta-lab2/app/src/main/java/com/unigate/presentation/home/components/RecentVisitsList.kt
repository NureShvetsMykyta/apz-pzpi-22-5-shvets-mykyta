package com.unigate.presentation.home.components

import android.os.Build
import androidx.annotation.RequiresApi
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.unigate.presentation.home.RecentVisit
import java.time.format.DateTimeFormatter

@RequiresApi(Build.VERSION_CODES.O)
@Composable
fun RecentVisitsList(
    items: List<RecentVisit>,
    modifier: Modifier = Modifier
) {
    Column(modifier.padding(8.dp)) {
        Text("Recent Visits", style = MaterialTheme.typography.titleMedium)
        Spacer(Modifier.height(8.dp))
        LazyColumn {
            items(items) { visit ->
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 4.dp),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text(visit.accessPoint, style = MaterialTheme.typography.bodyLarge)
                    Text(visit.date.format(DateTimeFormatter.ofPattern("MM/dd/yyyy")),
                        style = MaterialTheme.typography.bodyLarge)
                }
            }
        }
    }
}
