import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex); // vue的插件机制

// Vuex.Store 构造器选项
const store = new Vuex.Store({
  state: {
    // 存放状态
    chatMap: {}
  },
  mutations: {
    pushMessage(state, { uid, msg }) {
      // 变更状态
      if (state.chatMap[uid]) {
        state.chatMap[uid].push(msg);
      } else {
        Vue.set(state.chatMap, uid, [msg]);
      }
    }
  }
});
export default store;
