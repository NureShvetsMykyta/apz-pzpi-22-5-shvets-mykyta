package com.unigate.domain.repository

import com.unigate.domain.model.User

interface UserRepository {
    suspend fun getCurrentUser(): Result<User>
    suspend fun getUserQrCode(): Result<ByteArray>
}