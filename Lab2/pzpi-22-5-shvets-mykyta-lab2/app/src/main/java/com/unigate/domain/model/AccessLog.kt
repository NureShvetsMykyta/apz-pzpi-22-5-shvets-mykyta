package com.unigate.domain.model

import com.unigate.domain.enums.AccessStatus
import java.time.OffsetDateTime

data class AccessLog(
    val id:          Long,
    val accessTime:  OffsetDateTime,
    val status:      AccessStatus,
    val reason:      String?,
    val userId:      Long,
    val roomName:    String
)