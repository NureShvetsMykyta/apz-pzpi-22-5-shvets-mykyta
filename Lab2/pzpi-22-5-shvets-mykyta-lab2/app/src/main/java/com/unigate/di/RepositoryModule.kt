package com.unigate.di

import com.unigate.data.repository.AccessLogRepositoryImpl
import com.unigate.data.repository.AccessRuleRepositoryImpl
import com.unigate.data.repository.AuthRepositoryImpl
import com.unigate.data.repository.UserRepositoryImpl
import com.unigate.domain.repository.AccessLogRepository
import com.unigate.domain.repository.AccessRuleRepository
import com.unigate.domain.repository.AuthRepository
import com.unigate.domain.repository.UserRepository
import dagger.Binds
import dagger.Module
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
abstract class RepositoryModule {
    @Binds @Singleton
    abstract fun bindAuthRepository(
        impl: AuthRepositoryImpl
    ): AuthRepository

    @Binds @Singleton
    abstract fun bindUserRepo(
        impl: UserRepositoryImpl
    ): UserRepository

    @Binds @Singleton
    abstract fun bindAccessLogRepo(
        impl: AccessLogRepositoryImpl
    ): AccessLogRepository

    @Binds @Singleton
    abstract fun bindAccessRuleRepo(
        impl: AccessRuleRepositoryImpl
    ): AccessRuleRepository
}
