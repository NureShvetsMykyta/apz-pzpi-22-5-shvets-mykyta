package com.unigate.data.remote.dto

import android.os.Build
import androidx.annotation.RequiresApi
import com.unigate.domain.enums.AppUserRole
import com.unigate.domain.enums.CampusZoneType
import com.unigate.domain.model.AccessRule
import java.time.LocalDate
import java.time.LocalTime

data class AccessRuleDto(
    val id: Long,
    val userRole: AppUserRole,
    val zoneType: CampusZoneType,
    val hasAccess: Boolean,
    val startTime: String?,
    val endTime: String?,
    val startDate: String?,
    val endDate: String?
) {
    @RequiresApi(Build.VERSION_CODES.O)
    fun toDomain() = AccessRule(
        id = id,
        userRole = userRole,
        zoneType = zoneType,
        hasAccess = hasAccess,
        startTime = startTime?.let(LocalTime::parse),
        endTime   = endTime  ?.let(LocalTime::parse),
        startDate = startDate?.let(LocalDate::parse),
        endDate   = endDate  ?.let(LocalDate::parse)
    )
}