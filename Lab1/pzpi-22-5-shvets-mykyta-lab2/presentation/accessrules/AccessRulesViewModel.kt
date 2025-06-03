package com.unigate.presentation.accessrules

import android.os.Build
import androidx.annotation.RequiresApi
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.unigate.domain.repository.AccessRuleRepository
import com.unigate.presentation.accessrules.model.AccessRuleUiModel
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@RequiresApi(Build.VERSION_CODES.O)
@HiltViewModel
class AccessRulesViewModel @Inject constructor(
    private val rulesRepo: AccessRuleRepository
) : ViewModel() {

    private val _state = MutableStateFlow(AccessRulesUiState())
    val state: StateFlow<AccessRulesUiState> = _state

    init {
        loadRules()
    }

    private fun loadRules() {
        viewModelScope.launch {
            _state.value = _state.value.copy(isLoading = true, error = null)

            val result = rulesRepo.getAllRules()
            if (result.isFailure) {
                _state.value = _state.value.copy(
                    isLoading = false,
                    error = result.exceptionOrNull()?.message ?: "Unknown error"
                )
                return@launch
            }

            val rules = result.getOrNull().orEmpty().map {
                AccessRuleUiModel(
                    zone = it.zoneType.name,
                    access = it.hasAccess,
                    startTime = it.startTime,
                    endTime = it.endTime
                )
            }

            _state.value = _state.value.copy(
                items = rules,
                isLoading = false
            )
        }
    }
}