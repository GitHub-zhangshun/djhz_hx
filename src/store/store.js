import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate"
Vue.use(Vuex)
export default new Vuex.Store({
    state:{
        interface:'',//全局的接口
    },
    mutations:{
        //接口方法
        JK_interface(state,obj){
            state.interface = obj.result
        }
    },
    getters:{},
    actions:{},
    plugins: [createPersistedState({
        storage: window.sessionStorage,
        reducer(val) {
            return {
            // 只储存state中的user
            interface:val.interface
          }
       }
    })]
})