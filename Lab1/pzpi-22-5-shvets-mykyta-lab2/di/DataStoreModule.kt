package com.unigate.di

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.preferencesDataStoreFile
import androidx.datastore.preferences.core.PreferenceDataStoreFactory
import com.unigate.data.local.AuthPreferences
import com.unigate.data.local.AuthPreferencesImpl
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object DataStoreModule {
    private const val DATASTORE_NAME = "auth_prefs"

    @Provides
    @Singleton
    fun provideDataStore(@ApplicationContext context: Context): DataStore<Preferences> =
        PreferenceDataStoreFactory.create(
            produceFile = { context.preferencesDataStoreFile(DATASTORE_NAME) }
        )

    @Provides
    @Singleton
    fun provideAuthPreferences(dataStore: DataStore<Preferences>): AuthPreferences =
        AuthPreferencesImpl(dataStore)
}