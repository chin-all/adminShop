import axios from "axios"
import store from "@/store"
import router from "@/router"

axios.interceptors.request.use(config => {
    // Do something before request is sent
    let token = localStorage.getItem("info")?JSON.parse(localStorage.getItem("info")).token:"";
    // 每一次请求都会尝试获取token，每个请求都带上token
    config.headers.Authorization = token;
    
    return config;
}, error => {
    // Do something with request error
    return Promise.reject(error);
});
