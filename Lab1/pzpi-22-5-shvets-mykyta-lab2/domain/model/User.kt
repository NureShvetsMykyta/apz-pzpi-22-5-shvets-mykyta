package com.unigate.domain.model

import com.unigate.domain.enums.AppUserRole

data class User(
    val id: Long,
    val firstName: String,
    val lastName: String,
    val email: String,
    val role: AppUserRole
)