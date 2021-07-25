// 封装 axios 请求模块

import axios from "axios"
import jsonBig from 'json-bigint'

// 非组件模块获取store必须通过下列方式
import store from '@/store/'

const request = axios.create({
    // 基础路径
    baseURL: "http://ttapi.research.itcast.cn/",
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
// request.interceptors.response.use(function (response) {
//     // 对响应数据做点什么
//     return response;
// }, function (error) {
//     // 对响应错误做点什么
//     return Promise.reject(error);
// });

export default request