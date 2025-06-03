package com.unigate.domain.model

data class Building(
    val id: Long,
    val name: String,
    val description: String?,
    val location: String?
)