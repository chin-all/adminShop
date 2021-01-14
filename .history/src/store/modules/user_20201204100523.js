import {login} from ""
import router from "../../router"

const state = ()=>{
    return {
        info: {}
    }
}

const getters = {
    username(state) {
       return state.info.username 
    } 
}

const mutations = {
    set_info(state, info) {
        state.info = info
    }
}

const actions = {
    async SET_INFO({commit}, data) {
        let info = await login(data)
        if(info.code = 200){
            localStorage.setItem("info",JSON.stringify(info.list))
            localStorage.setItem("token",JSON.stringify(info.list.token))
            commit("set_info", info)
            router.replace("/")
        }
    }
}