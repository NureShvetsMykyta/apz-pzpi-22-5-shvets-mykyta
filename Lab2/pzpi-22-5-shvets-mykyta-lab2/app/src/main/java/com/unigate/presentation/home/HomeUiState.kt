package com.unigate.presentation.home

import java.time.LocalDate

data class HomeUiState(
    val firstName: String       = "",
    val accessLevel: String     = "",
    val visits7DaysCount: Int   = 0,
    val accessRulesCount: Int   = 0,
    val visitsByDate: List<Pair<LocalDate, Int>> = emptyList(),
    val recentVisits: List<RecentVisit>           = emptyList(),
    val isLoading: Boolean      = true,
    val error: String?          = null
)
