package com.unigate.presentation.navigation

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccountCircle
import androidx.compose.material.icons.filled.History
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Logout
import androidx.compose.material.icons.filled.Rule
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

@Composable
fun AppDrawer(
    currentRoute: String,
    onNavigate: (String) -> Unit,
    userName: String,
    onLogout: () -> Unit
) {
    val drawerBg = MaterialTheme.colorScheme.surface
    val statusBarHeight = getStatusBarHeight()

    Column(
        modifier = Modifier
            .fillMaxHeight()
            .width(280.dp)
            .background(drawerBg)
            .padding(top = statusBarHeight + 18.dp, bottom = 12.dp),
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        Column(modifier = Modifier.fillMaxWidth()) {
            Row(
                Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp, vertical = 8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Default.AccountCircle,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.primary,
                    modifier = Modifier
                        .size(38.dp)
                        .clip(RoundedCornerShape(12.dp))
                )
                Spacer(Modifier.width(10.dp))
                Text(
                    userName,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
            }
            Spacer(Modifier.height(10.dp))
            Divider()
            DrawerMenuItem(
                text = "Home",
                icon = Icons.Default.Home,
                selected = currentRoute == "home",
                onClick = { onNavigate("home") }
            )
            DrawerMenuItem(
                text = "History",
                icon = Icons.Default.History,
                selected = currentRoute == "history",
                onClick = { onNavigate("history") }
            )
            DrawerMenuItem(
                text = "Access Rules",
                icon = Icons.Default.Rule,
                selected = currentRoute == "accessrules",
                onClick = { onNavigate("accessrules") }
            )
        }
        Column {
            Divider(Modifier.padding(horizontal = 16.dp, vertical = 6.dp))
            DrawerMenuItem(
                text = "Logout",
                icon = Icons.Default.Logout,
                selected = false,
                danger = true,
                onClick = onLogout
            )
        }
    }
}

@Composable
fun getStatusBarHeight(): Dp {
    val view = LocalView.current
    val density = LocalDensity.current
    val resId = view.context.resources.getIdentifier("status_bar_height", "dimen", "android")
    val px = if (resId > 0) view.context.resources.getDimensionPixelSize(resId) else 0
    return with(density) { px.toDp() }
}

@Composable
fun DrawerMenuItem(
    text: String,
    icon: ImageVector,
    selected: Boolean,
    danger: Boolean = false,
    onClick: () -> Unit
) {
    val color = when {
        danger -> MaterialTheme.colorScheme.error
        selected -> MaterialTheme.colorScheme.primary
        else -> MaterialTheme.colorScheme.onSurface
    }
    val bg = when {
        selected -> MaterialTheme.colorScheme.primary.copy(alpha = 0.08f)
        danger -> MaterialTheme.colorScheme.error.copy(alpha = 0.06f)
        else -> Color.Transparent
    }
    Surface(
        color = bg,
        shape = MaterialTheme.shapes.medium,
        modifier = Modifier
            .padding(horizontal = 8.dp, vertical = 2.dp)
            .clip(MaterialTheme.shapes.medium)
            .fillMaxWidth()
            .height(48.dp)
            .clickable { onClick() }
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier
                .fillMaxSize()
                .padding(start = 16.dp)
        ) {
            Icon(icon, contentDescription = null, tint = color)
            Spacer(Modifier.width(14.dp))
            Text(
                text,
                color = color,
                style = MaterialTheme.typography.bodyLarge,
                fontWeight = if (selected) FontWeight.Bold else FontWeight.Normal
            )
        }
    }
}
