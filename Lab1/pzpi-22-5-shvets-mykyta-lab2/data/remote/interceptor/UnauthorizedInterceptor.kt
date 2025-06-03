package com.unigate.data.remote.interceptor

import kotlinx.coroutines.runBlocking
import okhttp3.Interceptor
import okhttp3.Response
import javax.inject.Inject
import javax.inject.Singleton
import com.unigate.data.local.AuthPreferences

@Singleton
class UnauthorizedInterceptor @Inject constructor(
    private val authPreferences: AuthPreferences
) : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        val response = chain.proceed(chain.request())
        if (response.code == 401) {
            runBlocking { authPreferences.clearToken() }
        }
        return response
    }
}