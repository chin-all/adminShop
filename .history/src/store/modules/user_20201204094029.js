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