package com.unigate.domain.repository

interface AuthRepository {
    suspend fun login(email: String, password: String): Result<String>
    suspend fun register(
        firstName: String,
        lastName: String,
        role: String,
        email: String
    ): Result<Unit>
    suspend fun logout(): Result<Unit>
    suspend fun changePassword(oldPassword: String, newPassword: String): Result<Unit>
    suspend fun requestPasswordReset(email: String): Result<Unit>
    suspend fun verifyOtp(email: String, otpCode: String): Result<String>
    suspend fun resetPassword(resetToken: String, email: String, newPassword: String): Result<Unit>
}