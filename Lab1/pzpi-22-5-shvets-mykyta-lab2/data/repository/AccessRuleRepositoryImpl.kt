package com.unigate.data.repository

import android.os.Build
import androidx.annotation.RequiresApi
import com.unigate.data.remote.api.UniGateApi
import com.unigate.domain.repository.AccessRuleRepository
import javax.inject.Inject

class AccessRuleRepositoryImpl @Inject constructor(
    private val api: UniGateApi
) : AccessRuleRepository {
    @RequiresApi(Build.VERSION_CODES.O)
    override suspend fun getAllRules() = runCatching {
        val resp = api.getAccessRules()
        check(resp.isSuccessful) { "Error ${resp.code()}: ${resp.errorBody()?.string()}" }
        resp.body()!!.map { it.toDomain() }
    }
}