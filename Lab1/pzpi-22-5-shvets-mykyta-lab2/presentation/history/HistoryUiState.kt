package com.unigate.presentation.history

import com.unigate.presentation.history.model.AccessLogUiModel

data class HistoryUiState(
    val items: List<AccessLogUiModel> = emptyList(),
    val page: Int                    = 0,
    val isLoading: Boolean           = false,
    val endReached: Boolean          = false,
    val error: String?               = null
)
