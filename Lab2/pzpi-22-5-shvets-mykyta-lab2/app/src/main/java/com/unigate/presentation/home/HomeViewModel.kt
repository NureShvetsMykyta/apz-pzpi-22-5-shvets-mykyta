package com.unigate.presentation.home

import android.os.Build
import androidx.annotation.RequiresApi
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.unigate.domain.repository.AccessLogRepository
import com.unigate.domain.repository.AccessRuleRepository
import com.unigate.domain.repository.UserRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import java.time.LocalDate
import javax.inject.Inject

@RequiresApi(Build.VERSION_CODES.O)
@HiltViewModel
class HomeViewModel @Inject constructor(
    private val userRepo: UserRepository,
    private val logsRepo: AccessLogRepository,
    private val rulesRepo: AccessRuleRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(HomeUiState())
    val uiState: StateFlow<HomeUiState> = _uiState.asStateFlow()

    init { loadAll() }

    @RequiresApi(Build.VERSION_CODES.O)
    private fun loadAll() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }

            val userRes  = userRepo.getCurrentUser()
            val logsRes  = logsRepo.getUserLogs(pageNum = 1, pageSize = 5)
            val rulesRes = rulesRepo.getAllRules()

            if (userRes.isFailure || logsRes.isFailure || rulesRes.isFailure) {
                _uiState.update {
                    it.copy(
                        isLoading = false,
                        error = userRes.exceptionOrNull()?.message
                            ?: logsRes.exceptionOrNull()?.message
                            ?: rulesRes.exceptionOrNull()?.message
                    )
                }
                return@launch
            }

            val user  = userRes.getOrThrow()
            val logs  = logsRes.getOrNull().orEmpty()
            val rules = rulesRes.getOrNull().orEmpty()

            val today = LocalDate.now()
            val window = (0..6).map { today.minusDays(6 - it.toLong()) }
            val byDate = logs.groupingBy { it.accessTime.toLocalDate() }.eachCount()
            val visitsByDate = window.map { it to (byDate[it] ?: 0) }

            val recent = logs
                .sortedByDescending { it.accessTime }
                .take(5)
                .map { RecentVisit(it.roomName, it.accessTime.toLocalDate()) }

            _uiState.update {
                it.copy(
                    firstName        = user.firstName,
                    accessLevel      = user.role.name,
                    visits7DaysCount = logs.count {
                        it.accessTime.toLocalDate() >= today.minusDays(6)
                    },
                    accessRulesCount = rules.size,
                    visitsByDate     = visitsByDate,
                    recentVisits     = recent,
                    isLoading        = false
                )
            }
        }
    }
}
