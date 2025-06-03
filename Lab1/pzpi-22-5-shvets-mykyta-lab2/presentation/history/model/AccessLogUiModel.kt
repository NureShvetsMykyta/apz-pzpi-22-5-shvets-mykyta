package com.unigate.presentation.history.model

import java.time.LocalDate

data class AccessLogUiModel(
    val accessPoint: String,
    val date: LocalDate,
    val status: String,
    val reason: String?
)
