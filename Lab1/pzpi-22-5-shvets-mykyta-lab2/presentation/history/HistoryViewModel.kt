package com.unigate.presentation.history

import android.os.Build
import androidx.annotation.RequiresApi
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.unigate.domain.repository.AccessLogRepository
import com.unigate.presentation.history.model.AccessLogUiModel
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

@RequiresApi(Build.VERSION_CODES.O)
@HiltViewModel
class HistoryViewModel @Inject constructor(
    private val repo: AccessLogRepository
) : ViewModel() {

    private val _state = MutableStateFlow(HistoryUiState())
    val state: StateFlow<HistoryUiState> = _state

    private val PAGE_SIZE = 50

    init {
        loadNextPage()
    }

    @RequiresApi(Build.VERSION_CODES.O)
    fun loadNextPage() {
        val s = _state.value
        if (s.isLoading || s.endReached) return

        viewModelScope.launch {
            _state.update { it.copy(isLoading = true, error = null) }

            repo.getUserLogs(pageNum = s.page + 1, pageSize = PAGE_SIZE)
                .onSuccess { domainList ->
                    val uiPage = domainList.map { log ->
                        AccessLogUiModel(
                            accessPoint = log.roomName,
                            date        = log.accessTime.toLocalDate(),
                            status      = log.status.name,
                            reason      = log.reason
                        )
                    }
                    _state.update {
                        it.copy(
                            items      = it.items + uiPage,
                            page       = it.page + 1,
                            isLoading  = false,
                            endReached = uiPage.size < PAGE_SIZE
                        )
                    }
                }
                .onFailure { ex ->
                    _state.update {
                        it.copy(isLoading = false, error = ex.message)
                    }
                }
        }
    }
}
