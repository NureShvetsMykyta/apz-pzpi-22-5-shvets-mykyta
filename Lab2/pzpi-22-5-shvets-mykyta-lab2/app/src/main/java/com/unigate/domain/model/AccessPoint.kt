package com.unigate.domain.model

import java.time.OffsetDateTime

data class AccessPoint(
    val id: Long,
    val type: String,
    val identifier: String,
    val createdAt: OffsetDateTime,
    val updatedAt: OffsetDateTime?,
    val roomId: Long
)