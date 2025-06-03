package com.unigate.data.remote.dto

import android.os.Build
import androidx.annotation.RequiresApi
import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass
import com.unigate.domain.enums.AccessStatus
import com.unigate.domain.model.AccessLog
import java.time.OffsetDateTime

@JsonClass(generateAdapter = true)
data class AccessLogDto(
    val id: Long = 0L,

    @Json(name = "time")        val accessTime:  String? = null,
    val status:    AccessStatus? = null,
    val reason:    String?       = null,
    @Json(name = "fullName")    val fullName:   String? = null,
    @Json(name = "roomName")    val roomName:   String? = null,
    @Json(name = "userId")      val userId:     Long   = 0L
) {
    @RequiresApi(Build.VERSION_CODES.O)
    fun toDomain(): AccessLog {
        val time  = accessTime
            ?.let(OffsetDateTime::parse)
            ?: OffsetDateTime.now()
        val st    = status ?: AccessStatus.Denied
        val room  = roomName  ?: "Unknown"

        return AccessLog(
            id          = id,
            accessTime  = time,
            status      = st,
            reason      = reason,
            userId      = userId,
            roomName    = room
        )
    }
}

