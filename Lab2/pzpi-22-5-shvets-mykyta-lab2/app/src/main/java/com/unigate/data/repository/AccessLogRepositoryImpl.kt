package com.unigate.data.repository

import android.os.Build
import androidx.annotation.RequiresApi
import com.unigate.data.remote.api.UniGateApi
import com.unigate.domain.repository.AccessLogRepository
import javax.inject.Inject

class AccessLogRepositoryImpl @Inject constructor(
    private val api: UniGateApi
) : AccessLogRepository {

    @RequiresApi(Build.VERSION_CODES.O)
    override suspend fun getUserLogs(pageNum: Int, pageSize: Int) = runCatching {
        val resp = api.getUserAccessLogs(pageNum, pageSize)
        check(resp.isSuccessful) { "Error ${resp.code()}: ${resp.errorBody()?.string()}" }
        resp.body()!!.map { it.toDomain() }
    }
}
