<template>
  <view class="content">
    <view>
      <view class="form-item">
        <input
          class="uni-input"
          v-model="user"
          focus
          placeholder="请输入用户ID"
        />
      </view>
      <view class="form-item">
        <input
          class="uni-input"
          v-model="pwd"
          type="password"
          focus
          placeholder="请输入登录密码"
        />
      </view>
      <button type="primary" @click="login" class="btn">Login</button>
    </view>
  </view>
</template>
<script>
const conn = uni.conn;
export default {
  data() {
    return {
      user: "",
      pwd: ""
    };
  },
  onLoad() {},
  methods: {
    login() {
      conn
        .open({
          user: this.user,
          pwd: this.pwd
        })
        .then(() => {
          uni.redirectTo({
            url: "../contacts/index"
          });
        })
        .catch((e) => {
          if (e.data.data.error_description === "invalid password") {
            uni.showToast({
              icon: "none",
              title: "用户名或密码错误"
            });
          } else {
            uni.showToast({
              icon: "none",
              title: "登录失败"
            });
          }
        });
    }
  }
};
</script>

<style>
.content {
  padding: 60rpx 24rpx 0 24rpx;
  height: 100vh;
  background-color: rgb(241, 241, 241);
}

.text-area {
  display: flex;
  justify-content: center;
}

.btn {
  font-size: 36rpx;
}

.form-item {
  display: flex;
  padding: 16rpx 26rpx;
  flex-direction: row;
  flex-wrap: nowrap;
  background-color: #fff;
  margin-bottom: 12rpx;
}
</style>
