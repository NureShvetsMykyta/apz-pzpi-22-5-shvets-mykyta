package com.unigate.data.repository

import com.unigate.data.local.AuthPreferences
import com.unigate.data.remote.api.UniGateAuthApi
import com.unigate.data.remote.dto.auth.*
import com.unigate.domain.repository.AuthRepository
import kotlinx.coroutines.flow.firstOrNull
import javax.inject.Inject

class AuthRepositoryImpl @Inject constructor(
    private val api: UniGateAuthApi,
    private val prefs: AuthPreferences
) : AuthRepository {

    override suspend fun login(email: String, password: String): Result<String> {
        val resp = api.login(LoginRequest(email, password))
        return if (resp.isSuccessful) {
            val token = resp.body()?.token.orEmpty()
            prefs.saveToken(token)
            Result.success(token)
        } else {
            Result.failure(Exception("Login error: ${resp.code()} ${resp.errorBody()?.string()}"))
        }
    }

    override suspend fun register(
        firstName: String,
        lastName: String,
        role: String,
        email: String
    ): Result<Unit> {
        val resp = api.register(RegisterRequest(firstName, lastName, role, email))
        return if (resp.isSuccessful) {
            Result.success(Unit)
        } else {
            Result.failure(Exception("Register error: ${resp.code()} ${resp.errorBody()?.string()}"))
        }
    }

    override suspend fun logout(): Result<Unit> {
        val token = prefs.tokenFlow.firstOrNull().orEmpty()
        val resp = api.logout("Bearer $token")
        if (resp.isSuccessful) {
            prefs.clearToken()
            return Result.success(Unit)
        }
        return Result.failure(Exception("Logout error: ${resp.code()}"))
    }

    override suspend fun changePassword(oldPassword: String, newPassword: String): Result<Unit> {
        val token = prefs.tokenFlow.firstOrNull().orEmpty()
        val resp = api.changePassword("Bearer $token", PasswordChangeRequest(oldPassword, newPassword))
        return if (resp.isSuccessful) Result.success(Unit)
        else Result.failure(Exception("Change password error: ${resp.code()}"))
    }

    override suspend fun requestPasswordReset(email: String): Result<Unit> {
        val resp = api.resetPasswordRequest(PasswordResetRequest(email))
        return if (resp.isSuccessful) Result.success(Unit)
        else Result.failure(Exception("Reset request error: ${resp.code()}"))
    }

    override suspend fun verifyOtp(email: String, otpCode: String): Result<String> {
        val resp = api.verifyOtp(OtpValidationRequest(email, otpCode))
        return if (resp.isSuccessful) {
            val token = resp.body()?.resetToken.orEmpty()
            Result.success(token)
        } else {
            Result.failure(Exception("Verify OTP error: ${resp.code()}"))
        }
    }

    override suspend fun resetPassword(
        resetToken: String,
        email: String,
        newPassword: String
    ): Result<Unit> {
        val resp = api.resetPassword(
            PasswordUpdateRequest(resetToken, email, newPassword)
        )
        return if (resp.isSuccessful) Result.success(Unit)
        else Result.failure(Exception("Reset password error: ${resp.code()}"))
    }
}
