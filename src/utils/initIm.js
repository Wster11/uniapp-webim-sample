import webIM from "../sdk/uniapp-sdk-4.1.2";
import store from "../store";

/**
 * 以下配置信息可从console后台管理获得
 */
const IM_CONFIG = {
  isHttpDNS: false, // 开启后会从服务器取连接地址，目前不支持uniapp、小程序
  appKey: "1161210719091872#demo",
  apiUrl: "https://a1.easemob.com",
  url: "ws://im-api-wechat.easemob.com/websocket"
};

const conn = new webIM.connection(IM_CONFIG);

uni.conn = conn;

conn.addEventHandler("message", {
  onTextMessage: (message) => {
    // 表示是多端同步过来的消息
    let uid = message.from === uni.conn.user ? message.to : message.from;
    store.commit("pushMessage", { uid, msg: message });
  },
  onImageMessage: (message) => {
    let uid = message.from === uni.conn.user ? message.to : message.from;
    store.commit("pushMessage", { uid, msg: message });
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

export { IM_CONFIG };
export default conn;
