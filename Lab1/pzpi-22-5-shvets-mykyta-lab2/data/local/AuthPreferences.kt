package com.unigate.data.local

import kotlinx.coroutines.flow.Flow

interface AuthPreferences {
    val tokenFlow: Flow<String?>
    suspend fun saveToken(token: String)
    suspend fun clearToken()
}