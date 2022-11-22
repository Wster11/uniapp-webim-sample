import webIM from "../sdk/uniapp-sdk-4.1.2";
import store from "../store";

/**
 * 以下配置信息可从console后台管理获得
 */
const options = {
  isHttpDNS: false, // 开启后会从服务器取连接地址，目前不支持uniapp、小程序
  appKey: "1161210719091872#demo",
  apiUrl: "https://a1.easemob.com",
  url: "ws://im-api-wechat.easemob.com/websocket"
};

const conn = new webIM.connection(options);

uni.conn = conn;

conn.addEventHandler("message", {
  onTextMessage: (message) => {
    console.log(message, "message");
    store.commit("pushMessage", { uid: message.from, msg: message });
  }
});

export default conn;
