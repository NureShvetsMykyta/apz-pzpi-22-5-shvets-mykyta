package com.unigate.presentation.navigation

import android.os.Build
import androidx.annotation.RequiresApi
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.unigate.presentation.accessrules.AccessRulesScreen
import com.unigate.presentation.auth.AuthViewModel
import com.unigate.presentation.history.HistoryScreen
import com.unigate.presentation.home.HomeScreen
import com.unigate.presentation.home.HomeViewModel
import com.unigate.presentation.login.LoginScreen
import com.unigate.presentation.login.LoginViewModel

@RequiresApi(Build.VERSION_CODES.O)
@Composable
fun AppContainer(
    logout: () -> Unit = {}
) {
    val navController = rememberNavController()
    val homeViewModel: HomeViewModel = hiltViewModel()
    val homeState by homeViewModel.uiState.collectAsState()
    val userName = homeState.firstName.takeIf { it.isNotBlank() } ?: "User"
    val authViewModel: AuthViewModel = hiltViewModel()
    val token by authViewModel.tokenFlow.collectAsState()

    LaunchedEffect(token) {
        if (token.isNullOrBlank()) {
            navController.navigate("login") {
                popUpTo(0) { inclusive = true }
            }
        } else {
            navController.navigate("home") {
                popUpTo(0) { inclusive = true }
            }
        }
    }

    AppScaffold(
        navController = navController,
        userName = userName,
        onLogout = {
            logout()
            navController.navigate("login") {
                popUpTo(0) { inclusive = true }
                launchSingleTop = true
            }
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = "home",
            modifier = Modifier.padding(innerPadding)
        ) {
            composable("home")    { HomeScreen() }
            composable("history") { HistoryScreen() }
            composable("accessrules") { AccessRulesScreen() }
            composable("login") {
                val viewModel: LoginViewModel = hiltViewModel()
                val uiState by viewModel.uiState.collectAsState()
                LoginScreen(
                    uiState = uiState,
                    onEvent = viewModel::onEvent,
                    onSuccess = {
                        navController.navigate("home") {
                            popUpTo(0) { inclusive = true }
                        }
                    }
                )
            }
        }
    }
}
