import {login} from ""

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
    SET_INFO({commit}, data) {
        let info = login(data)
    }
}