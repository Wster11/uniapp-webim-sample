<template>
  <view class="content">
    <view class="msg-content">
      <view
        v-for="item in chatMsg"
        :key="item.id"
        :class="item.from !== user ? 'msg-item msg-left' : 'msg-item msg-right'"
      >
        <view class="from">{{ item.from || user }} </view>
        <!-- 文本消息 -->
        <view v-if="item.type === 'txt'" class="msg">{{ item.msg }} </view>
        <!-- 图片消息 -->
        <view v-else-if="item.type === 'img'">
          <image class="img-msg" mode="widthFix" :src="item.url"></image>
        </view>
        <view class="time">{{ new Date(item.time).toLocaleString() }} </view>
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
        <view @tap="selectImg" class="select-img"> </view>
      </view>
    </view>
  </view>
</template>
<script>
import webIM from "../../sdk/uniapp-sdk-4.1.2";
import { IM_CONFIG } from "../../utils/initIm";
import { MSG_TYPE } from "../../consts";

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
    selectImg() {
      let _this = this;
      const opt = {
        count: 1, // 默认9
        sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ["album"], // 从相册选择
        success: function (res) {
          let tempFilePath = res.tempFilePaths[0];
          var str = IM_CONFIG.appKey.split("#");
          var token = uni.conn.context.accessToken;
          // 上传文件
          uni.uploadFile({
            url: `${IM_CONFIG.apiUrl}/${str[0]}/${str[1]}/chatfiles`,
            filePath: tempFilePath,
            name: "file",
            header: {
              Authorization: `Bearer ${token}`
            },
            success(res) {
              let dt = JSON.parse(res.data);
              let uuid = dt.entities[0].uuid;
              let imgUrl = `${dt.uri}/${uuid}`;
              // Web端需要在 WebIMConfig.js中 设置 useOwnUploadFun: true
              const imgMsg = webIM.message.create({
                chatType: "singleChat",
                type: MSG_TYPE.img,
                url: imgUrl,
                to: _this.to
              });
              uni.conn.send(imgMsg).then((res) => {
                _this.$store.commit("pushMessage", {
                  uid: _this.to,
                  msg: imgMsg
                });
              });
            }
          });
        }
      };

      uni.chooseImage(opt);
    },
    sendTextMsg() {
      let textMsg = webIM.message.create({
        chatType: "singleChat",
        msg: this.msg,
        to: this.to,
        type: MSG_TYPE.txt
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

<style scoped>
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
  box-sizing: border-box;
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  background-color: #fff;
  padding: 14rpx;
}

.msg-item {
  width: 100%;
  margin-bottom: 20rpx;
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
  box-sizing: border-box;
  font-size: 26rpx;
  display: inline-block;
  max-width: 80vw;
  padding: 14rpx;
  background: #688ba1;
  border-radius: 20rpx;
  color: #fff;
}
.img-msg {
  max-width: 300rpx;
}
.select-img {
  width: 50rpx;
  background: url("../../static/image.png");
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
