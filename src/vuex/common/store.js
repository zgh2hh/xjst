import * as types from './mutationTypes'
import * as actions from './actions'

const state = {
  // 批次列表
  cultivate: {},
  user: null
}

const getters = {
  Cultivate: (state) => {
    return state.cultivate
  },
  Route: (state, getters, rootState) => {
    return rootState.route
  }
}

const mutations = {
  [types.LOGIN] (state) {
    state.user = state.user
  },
  [types.CULTIVATE] (state, data) {
    state.cultivate = data
  },
  [types.QUIT_LOGIN] (state) {
    // state.user = data
  }
}

export default {
  actions,
  state,
  getters,
  mutations
}
