import Vue from "vue";
import App from "./App";
import store from "./store";

Vue.config.productionTip = false;

// let plugin = uni.requireNativePlugin('NIMUniPlugin-PluginModule');

// plugin.getDeviceToken({
// 	suggestPushType: "8"
// }, (ret) => {
// 	console.log(6666, '888888')
// 	console.log(ret, 'retttttt')
// })
// console.log(plugin, 'plugin')

App.mpType = "app";

const app = new Vue({
	store,
	...App
});
app.$mount();