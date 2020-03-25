import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

import { state, State } from './state'
import { mutations } from './mutations'
import { getters } from './getters'
import { actions } from './actions'

Vue.use(Vuex)

const vuexLocal = new VuexPersistence<State>({
  storage: window.localStorage,
  reducer: (state) => ({
    board: state.board,
    newHow: state.newHow
  })
})

export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions,
  modules: {},
  plugins: [vuexLocal.plugin]
})
