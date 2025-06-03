package com.unigate.data.local

import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class TokenProvider @Inject constructor(
    authPreferences: AuthPreferences
) {
    private val _token = MutableStateFlow<String?>(null)
    val token: StateFlow<String?> = _token

    init {
        CoroutineScope(Dispatchers.IO).launch {
            authPreferences.tokenFlow.collect { saved ->
                _token.value = saved
            }
        }
    }

    fun getToken(): String? = _token.value
}
