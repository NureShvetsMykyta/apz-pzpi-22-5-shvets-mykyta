package com.unigate.domain.model

import com.unigate.domain.enums.AppUserRole
import com.unigate.domain.enums.CampusZoneType
import java.time.LocalDate
import java.time.LocalTime

data class AccessRule(
    val id: Long,
    val userRole: AppUserRole,
    val zoneType: CampusZoneType,
    val hasAccess: Boolean,
    val startTime: LocalTime?,
    val endTime: LocalTime?,
    val startDate: LocalDate?,
    val endDate: LocalDate?
)