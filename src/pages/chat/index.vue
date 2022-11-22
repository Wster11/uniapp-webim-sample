<template>
  <view class="content">
    <view class="msg-content">
      <view
        v-for="item in chatMsg"
        :key="item.id"
        :class="getMsgClassName(item)"
      >
        <!-- 文本消息 -->
        <view v-if="item.type === 'txt'">
          <view class="from">{{ item.from || user }} </view>
          <view class="msg">{{ item.msg }} </view>
          <view class="time">{{ new Date(item.time).toLocaleString() }} </view>
        </view>
      </view>
    </view>
    <view>
      <view class="input-content">
        <input
          class="uni-input"
          v-model="msg"
          focus
          confirm-type="search"
          @confirm="sendTextMsg"
          placeholder="请输入..."
        />
      </view>
    </view>
  </view>
</template>
<script>
import webIM from "../../sdk/uniapp-sdk-4.1.2";
export default {
  data() {
    return {
      msg: "",
      user: uni.conn.user,
      to: ""
    };
  },
  onLoad(e) {
    this.to = e.to;
    uni.setNavigationBarTitle({
      title: e.to
    });
  },
  computed: {
    chatMsg() {
      return this.$store.state.chatMap[this.to] || [];
    }
  },
  methods: {
    getMsgClassName(item) {
      if (item.from) {
        return "msg-item msg-left";
      } else {
        return "msg-item msg-right";
      }
    },
    sendTextMsg() {
      let textMsg = webIM.message.create({
        chatType: "singleChat",
        msg: this.msg,
        to: this.to,
        type: "txt"
      });
      uni.conn.send(textMsg).then((res) => {
        this.$store.commit("pushMessage", {
          uid: this.to,
          msg: textMsg
        });
        this.msg = "";
      });
    }
  }
};
</script>

<style>
.content {
  min-height: 100vh;
  background-color: rgb(241, 241, 241);
}

.text-area {
  display: flex;
  justify-content: center;
}

.btn {
  font-size: 36rpx;
}

.input-content {
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  background-color: #fff;
  padding: 14rpx;
}

.msg-item {
  width: 100%;
}

.from,
.time {
  font-size: 24rpx;
  color: #666;
}

.msg-content {
  padding: 24rpx;
}

.msg-left {
  text-align: left;
}

.msg-right {
  text-align: right;
}

.msg {
  font-size: 26rpx;
  display: inline-block;
  max-width: 80vw;
  padding: 14rpx;
  background: #4faeea;
  border-radius: 20rpx;
  color: #fff;
}
</style>
