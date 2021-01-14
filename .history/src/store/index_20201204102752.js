import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex);

let store = new Vuex.store({
    state: {

    },
    modules: {
        user
    }
})

export default store