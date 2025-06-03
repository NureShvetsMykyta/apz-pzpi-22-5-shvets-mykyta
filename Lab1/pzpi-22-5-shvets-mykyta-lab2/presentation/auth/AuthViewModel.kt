package com.unigate.presentation.auth

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.unigate.data.local.AuthPreferences
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import javax.inject.Inject

@HiltViewModel
class AuthViewModel @Inject constructor(
    private val authPreferences: AuthPreferences
) : ViewModel() {
    val tokenFlow: StateFlow<String?> = authPreferences.tokenFlow
        .stateIn(viewModelScope, SharingStarted.Eagerly, null)
}
