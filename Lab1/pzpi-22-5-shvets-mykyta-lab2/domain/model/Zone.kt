package com.unigate.domain.model

import com.unigate.domain.enums.CampusZoneType
import java.time.OffsetDateTime

data class Zone(
    val id: Long,
    val name: String,
    val description: String?,
    val zoneType: CampusZoneType,
    val createdAt: OffsetDateTime,
    val updatedAt: OffsetDateTime?
)