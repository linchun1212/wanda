import * as Types from "../mutations-type";
let state = {
  cinema: {}
};
let getters = {
  Cinema: function(state) {
    return state.cinema;
  }
};
let mutations = {
  [Types.SET_CINEMA]: function(state, newCinema) {
    state.cinema = newCinema;
  }
};
let actions = {
  actCinema: function({ commit }, newCinema) {
    commit(Types.SET_CINEMA, newCinema);
  }
};

export const cinema = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
