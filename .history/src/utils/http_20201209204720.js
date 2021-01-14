import axios from "axios"
import store from "@/store"
import router from "@/router"
import qs from "qs"

axios.interceptors.request.use(config => {
    // Do something before request is sent
    // 使用qs进行post加密和取消两次请求
    if (config.method == "post") {
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

// 产生不同的axios实例处理图片上传问题
let upload = axios.create();

uploadaxios.interceptors.request.use(config => {
    // Do something before request is sent
    let token = localStorage.getItem("info") ? JSON.parse(localStorage.getItem("info")).token : "";
    // 每一次请求都会尝试获取token
    //  每一请求带上token
    config.headers.Authorization = token;
    // 改写上传文件的请求头
    config.headers['Content-Type'] = "multipart/form-data";
    //上传文件需要的容器，空容器
    let formData = new FormData();
    // 容器使用 append 方法添加数据
    for (var key in config.data) {
        formData.append(key, config.data[key]);
    };
    return config;
}, error => {
    // Do something with request error
    //处理过期 说明token已过期
    if (response.data.code == 403) {
        // 清空登录数据
        localStorage.clear();
        store.commit("CLEAR_INFO");
        // 跳转到 登录页
        router.replace("/login");
    };

    return Promise.reject(error);
});


export default axios