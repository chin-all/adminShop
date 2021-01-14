import axios from "axios"
import store from "@/store"
import router from "@/router"
import qs from "qs"

axios.interceptors.request.use(config => {
    // Do something before request is sent
    // 使用qs进行post加密和取消两次请求
    if(config.method == "post"){
        config.data = qs.stringify(config.data);
    }
    let token = localStorage.getItem("info") ? JSON.parse(localStorage.getItem("info")).token : "";
    // 每一次请求都会尝试获取token，每个请求都带上token
    config.headers.Authorization = token;
    return config;
}, error => {
    // Do something with request error
    return Promise.reject(error);
});

axios.interceptors.response.use(response => {
    // Do something before response is sent
    // 处理过期，说明token已经过期
    if (response.data.code == 403) {
        // 清空登录数据
        localStorage.clear();
        store.commit("CLEAR_INFO");
        // 跳转到登录页
        router.replace("/login")
    }
    return response.data;
}, error => {
    // Do something with response error
    return Promise.reject(error);
});

export default axios