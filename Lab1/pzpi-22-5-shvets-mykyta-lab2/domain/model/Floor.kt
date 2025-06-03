package com.unigate.domain.model

data class Floor(
    val id: Long,
    val number: Int,
    val description: String?,
    val buildingId: Long
)