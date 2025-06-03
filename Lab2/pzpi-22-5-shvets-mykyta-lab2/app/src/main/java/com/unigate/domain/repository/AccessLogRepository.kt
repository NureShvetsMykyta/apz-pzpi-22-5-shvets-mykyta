package com.unigate.domain.repository

import com.unigate.domain.model.AccessLog

interface AccessLogRepository {
    suspend fun getUserLogs(
        pageNum: Int = 0,
        pageSize: Int = 50
    ): Result<List<AccessLog>>
}