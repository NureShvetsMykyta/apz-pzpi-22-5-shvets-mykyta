package com.unigate.data.remote.dto

import com.unigate.domain.enums.AppUserRole
import com.unigate.domain.model.User

data class UserDto(
    val id: Long,
    val firstName: String,
    val lastName: String,
    val email: String,
    val role: AppUserRole
) {
    fun toDomain() = User(id, firstName, lastName, email, role)
}
