package com.unigate.data.remote.api

import com.unigate.data.remote.dto.*
import okhttp3.ResponseBody
import retrofit2.Response
import retrofit2.http.*

interface UniGateApi {

    @GET("/api/accesslog/user")
    suspend fun getUserAccessLogs(
        @Query("pageNum") pageNum: Int,
        @Query("count")   count:   Int
    ): Response<List<AccessLogDto>>

    @GET("/api/accessrule/my")
    suspend fun getAccessRules(): Response<List<AccessRuleDto>>

    @GET("/api/user")
    suspend fun getCurrentUser(): Response<UserDto>

    @GET("api/user/qrcode")
    suspend fun getUserQrCode(): Response<ResponseBody>
}