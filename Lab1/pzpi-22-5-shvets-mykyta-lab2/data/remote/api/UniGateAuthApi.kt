package com.unigate.data.remote.api

import com.unigate.data.remote.dto.auth.*
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.Header
import retrofit2.http.POST

interface UniGateAuthApi {

    @POST("api/auth/register")
    suspend fun register(
        @Body request: RegisterRequest
    ): Response<String>

    @POST("api/auth/login")
    suspend fun login(
        @Body request: LoginRequest
    ): Response<LoginResponse>

    @POST("api/auth/logout")
    suspend fun logout(
        @Header("Authorization") bearerToken: String
    ): Response<String>

    @POST("api/auth/assign-role")
    suspend fun assignRole(
        @Header("Authorization") bearerToken: String,
        @Body request: AssignRoleRequest
    ): Response<String>

    @POST("api/auth/change-password")
    suspend fun changePassword(
        @Header("Authorization") bearerToken: String,
        @Body request: PasswordChangeRequest
    ): Response<String>

    @POST("api/auth/reset-password-request")
    suspend fun resetPasswordRequest(
        @Body request: PasswordResetRequest
    ): Response<String>

    @POST("api/auth/verify-otp")
    suspend fun verifyOtp(
        @Body request: OtpValidationRequest
    ): Response<PasswordResetResponse>

    @POST("api/auth/reset-password")
    suspend fun resetPassword(
        @Body request: PasswordUpdateRequest
    ): Response<String>
}
