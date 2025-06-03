package com.unigate.data.local

import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import javax.inject.Inject

private val KEY_TOKEN = stringPreferencesKey("KEY_JWT_TOKEN")

class AuthPreferencesImpl @Inject constructor(
    private val dataStore: DataStore<Preferences>
) : AuthPreferences {
    override val tokenFlow: Flow<String?> =
        dataStore.data.map { prefs -> prefs[KEY_TOKEN] }

    override suspend fun saveToken(token: String) {
        dataStore.edit { prefs ->
            prefs[KEY_TOKEN] = token
        }
    }

    override suspend fun clearToken() {
        dataStore.edit { prefs ->
            prefs.remove(KEY_TOKEN)
        }
    }
}
