import webIM from "../sdk/4.1.7-uni-log";
import store from "../store";
import Storage from "../../uni_modules/rexcoder-easeim-storage/js_sdk/storage";

import {
  writeLog,
  delLogFile,
  getLogFileName,
  selectLogUrl
} from "../sdk/log.js";

/**
 * 以下配置信息可从console后台管理获得
 */
const IM_CONFIG = {
  isHttpDNS: false, // 开启后会从服务器取连接地址，目前不支持uniapp、小程序
  appKey: "easemob-demo#support",
  apiUrl: "https://a1.easemob.com",
  url: "ws://im-api-wechat.easemob.com/websocket"
};

console.log(webIM, "webIM");

// webIM.logger.disableAll()
const conn = new webIM.connection(IM_CONFIG);

uni.conn = conn;
uni.webIM = webIM;

conn.addEventHandler("message", {
  onTextMessage: (message) => {
    // 表示是多端同步过来的消息
    let uid = message.from === uni.conn.user ? message.to : message.from;
    store.commit("pushMessage", {
      uid,
      msg: message
    });
  },
  onImageMessage: (message) => {
    let uid = message.from === uni.conn.user ? message.to : message.from;
    store.commit("pushMessage", {
      uid,
      msg: message
    });
  }
});

conn.addEventHandler("contact", {
  onContactInvited: (message) => {
    console.log(message, "contact invite msg");
    uni.showModal({
      title: `${message.from}请求添加好友`,
      content: message.status,
      cancelText: "拒绝",
      confirmText: "接受",
      success: (res) => {
        if (res.confirm === true) {
          // 接受好友申请
          conn.acceptContactInvite(message.from);
        } else {
          // 拒绝好友申请
          conn.declineContactInvite(message.from);
        }
      }
    });
  },
  onContactAgreed: (message) => {
    console.log(message, "contact agreed msg");
    uni.showToast({
      icon: "none",
      title: `${message.from}已同意你的好友申请`
    });
  },
  onContactRefuse: (message) => {
    console.log(message, "contact refuse msg");
    uni.showToast({
      icon: "none",
      title: `${message.from}已拒绝你的好友申请`
    });
  }
});

new Storage({
  connection: conn
});

export { IM_CONFIG };
export default conn;
