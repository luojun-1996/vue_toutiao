// 封装 axios 请求模块

import axios from "axios"
import jsonBig from 'json-bigint'
import { Toast } from "vant"

// 非组件模块获取store必须通过下列方式
import store from '@/store/'

import router from '@/router/'

const refreshTokenReq = axios.create({
    baseURL: 'http://ttapi.research.itcast.cn/'
})

const request = axios.create({
    // 基础路径
    baseURL: 'http://ttapi.research.itcast.cn/',
    transformResponse: [function (data) {
        try {
            // 如果转换成功则返回转换的数据结果
            return jsonBig.parse(data)
        } catch (err) {
            // 如果转换失败，则包装为统一数据格式并返回
            return {
                data
            }
        }
    }]
})

// 添加请求拦截器
request.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    const { user } = store.state
    // 如果用户已登录，统一给接口设置token信息
    if (user) {
        config.headers.Authorization = `Bearer ${user.token}`
    }
    return config
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
});

// 添加响应拦截器
request.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response;
}, async function (error) {
    // 对响应错误做点什么

    const status = error.response.status
    if (status === 400) {
        // 客户端参数错误
        Toast.fail('客户端请求参数异常')
    } else if (status === 401) {
        // token 无效
        const { user } = store.state
        if (!user || !user.token) {
            return redirectLogin()
        }

        try {
            const { data } = await refreshTokenReq({
                method: 'PUT',
                url: '/app/v1_0/authorizations',
                headers: {
                    Authorization: `Bearer ${user.refresh_token}`
                }
            })
            user.token = data.data.token
            store.commit('setUser', user)

            return request(error.config)
        } catch (err) {
            redirectLogin()
        }

    } else if (status === 403) {
        // 没有权限
        Toast.fail('权限不够')
    } else if (status >= 500) {
        // 服务端异常
        Toast.fail('服务的异常，请稍后重试')
    }

    return Promise.reject(error);
})

function redirectLogin() {
    router.replace({
        name: 'login',
        query: {
            redirect: router.currentRoute.fullPath
        }
    })
}

export default request