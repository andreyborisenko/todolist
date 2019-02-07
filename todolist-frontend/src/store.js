import Vue from 'vue'
import Vuex from 'vuex'
import Cookie from 'js-cookie'

// Dont have time to implement, sry :(

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    todos: [],
    token: Cookie.get('jwt') || ''
  },
  actions: {
    GET_TODOS() {

    }
    //...
  },
  mutations: {
    SET_TOKEN(state, { token }) {
        state.token = token;
    }
    //...
  }
})