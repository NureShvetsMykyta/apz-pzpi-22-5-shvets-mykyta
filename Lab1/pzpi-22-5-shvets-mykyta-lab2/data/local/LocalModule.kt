package com.unigate.di

import com.unigate.data.local.AuthPreferences
import com.unigate.data.local.TokenProvider
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object LocalModule {

    @Provides
    @Singleton
    fun provideTokenProvider(
        authPreferences: AuthPreferences
    ): TokenProvider = TokenProvider(authPreferences)
}