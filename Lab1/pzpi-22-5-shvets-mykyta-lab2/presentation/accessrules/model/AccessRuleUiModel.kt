package com.unigate.presentation.accessrules.model

import java.time.LocalTime

data class AccessRuleUiModel(
    val zone: String,
    val access: Boolean,
    val startTime: LocalTime?,
    val endTime: LocalTime?
)