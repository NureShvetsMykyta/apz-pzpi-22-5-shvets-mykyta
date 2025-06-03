package com.unigate.data.remote.dto.auth

import com.squareup.moshi.Json

data class RegisterRequest(
    val firstName: String,
    val lastName: String,
    val role: String,
    val email: String
)

data class LoginRequest(
    val email: String,
    val password: String
)

data class AssignRoleRequest(
    val email: String,
    val roleName: String
)

data class PasswordChangeRequest(
    val oldPassword: String,
    val newPassword: String
)

data class PasswordResetRequest(
    val email: String
)

data class OtpValidationRequest(
    val email: String,
    @Json(name = "otpCode")
    val otpCode: String
)

data class PasswordUpdateRequest(
    val resetToken: String,
    val email: String,
    val newPassword: String
)

data class LoginResponse(
    @Json(name = "token")
    val token: String
)

data class PasswordResetResponse(
    @Json(name = "resetToken")
    val resetToken: String
)
