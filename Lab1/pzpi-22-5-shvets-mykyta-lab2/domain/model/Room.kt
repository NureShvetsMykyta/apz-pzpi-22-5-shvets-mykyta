package com.unigate.domain.model

import java.time.OffsetDateTime

data class Room(
    val id: Long,
    val name: String,
    val type: String?,
    val description: String?,
    val capacity: Int?,
    val createdAt: OffsetDateTime,
    val updatedAt: OffsetDateTime?,
    val floorId: Long,
    val zoneId: Long?
)