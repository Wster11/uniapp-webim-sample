<template>
  <view class="content">
    <view class="me">{{ user }} </view>
    <view class="form-item">
      <text class="form-item-label">添加好友：</text>
      <input class="uni-input" v-model="uid" focus placeholder="请输入用户ID" />
      <button
        class="form-item-btn"
        size="mini"
        type="primary"
        @tap="addContact"
      >
        添加
      </button>
    </view>
    <button class="log-out" @tap="logout">退出登录</button>
  </view>
</template>
<script>
const conn = uni.conn;
export default {
  data() {
    return {
      user: conn?.user,
      uid: ""
    };
  },
  onLoad() {},
  methods: {
    logout() {
      conn.close();
      uni.redirectTo({
        url: "../index/index"
      });
    },
    addContact() {
      conn.addContact(this.uid, "加个好友吧～");
    }
  }
};
</script>

<style scoped>
.content {
  padding: 60rpx 24rpx 0 24rpx;
  height: 100vh;
  background-color: rgb(241, 241, 241);
}

.me {
  margin: 0 auto;
  width: 150rpx;
  height: 150rpx;
  background: #3478f6;
  border-radius: 50%;
  line-height: 150rpx;
  text-align: center;
  color: #fff;
  margin-bottom: 200rpx;
}

.log-out {
  margin-top: 30rpx;
}

.form-item {
  display: flex;
  padding: 16rpx 26rpx;
  flex-direction: row;
  flex-wrap: nowrap;
  background-color: #fff;
  margin-bottom: 12rpx;
  align-items: center;
}
.form-item-label {
  flex-shrink: 0;
}
.form-item-btn {
  flex-shrink: 0;
}
</style>
