package com.unigate.presentation.login

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.unigate.domain.repository.AuthRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class LoginViewModel @Inject constructor(
    private val authRepository: AuthRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(LoginUiState())
    val uiState: StateFlow<LoginUiState> = _uiState.asStateFlow()

    fun onEvent(event: LoginEvent) {
        when (event) {
            is LoginEvent.EmailChanged -> {
                _uiState.update { it.copy(email = event.email, error = null) }
            }
            is LoginEvent.PasswordChanged -> {
                _uiState.update { it.copy(password = event.password, error = null) }
            }
            LoginEvent.Submit -> {
                login()
            }
        }
    }

    private fun login() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }

            val state = _uiState.value
            val result = authRepository.login(state.email.trim(), state.password)

            result.onSuccess { token ->
                _uiState.update { it.copy(isLoading = false, success = true) }
            }.onFailure { ex ->
                _uiState.update {
                    it.copy(
                        isLoading = false,
                        error = ex.message ?: "Unknown error"
                    )
                }
            }
        }
    }
}
