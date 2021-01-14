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