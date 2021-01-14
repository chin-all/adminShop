import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex);

// localStorage中存在info,说明已登录，vuex重新刷新，会被重置，可以从localStorage中获取
let info = localStorage.getItem("info")?JSON.parse(localStorage.getItem("info")).token:{};
let store = new Vuex.store({
    state: {
        // 登录用户信息
        info
    },
    getters: {
        username: state=>state.info.username
    }
})

export default store