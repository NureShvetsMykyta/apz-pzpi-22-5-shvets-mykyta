package com.unigate.data.repository

import com.unigate.data.remote.api.UniGateApi
import com.unigate.domain.model.User
import com.unigate.domain.repository.UserRepository
import javax.inject.Inject

class UserRepositoryImpl @Inject constructor(
    private val api: UniGateApi
) : UserRepository {
    override suspend fun getCurrentUser(): Result<User> = runCatching {
        val resp = api.getCurrentUser()
        check(resp.isSuccessful) { "GET /api/user failed ${resp.code()}" }
        resp.body()!!.toDomain()
    }

    override suspend fun getUserQrCode(): Result<ByteArray> {
        val response = api.getUserQrCode()
        return if (response.isSuccessful) {
            response.body()?.bytes()?.let { Result.success(it) } ?: Result.failure(Exception("Empty"))
        } else {
            Result.failure(Exception("Exception ${response.code()}"))
        }
    }
}
