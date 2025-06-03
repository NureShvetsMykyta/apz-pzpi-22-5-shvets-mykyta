package com.unigate.domain.repository

import com.unigate.domain.model.AccessRule

interface AccessRuleRepository {
    suspend fun getAllRules(): Result<List<AccessRule>>
}