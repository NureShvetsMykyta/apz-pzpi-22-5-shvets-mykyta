package com.unigate.presentation.accessrules

import com.unigate.presentation.accessrules.model.AccessRuleUiModel

data class AccessRulesUiState(
    val items: List<AccessRuleUiModel> = emptyList(),
    val isLoading: Boolean = false,
    val error: String? = null
)