<template>
  <view class="content">
    <view>
      <view class="form-item">
        <input
          class="uni-input"
          v-model="user"
          focus
          placeholder="请输入用户名"
        />
      </view>
      <view class="form-item">
        <input
          class="uni-input"
          v-model="pwd"
          type="password"
          focus
          placeholder="请输入密码"
        />
      </view>
      <button type="primary" :loading="loading" @tap="register" class="btn">
        立即注册
      </button>
    </view>
    <navigator url="/pages/index/index" open-type="redirect">
      <view class="register-tip">已账号? 去登录</view>
    </navigator>
  </view>
</template>
<script>
const conn = uni.conn;
export default {
  data() {
    return {
      user: "",
      pwd: "",
      loading: false
    };
  },
  onLoad() {},
  methods: {
    register() {
      this.loading = true;
      conn
        .registerUser({
          username: this.user,
          password: this.pwd
        })
        .then(() => {
          uni.showToast({
            icon: "none",
            title: "注册成功"
          });
          uni.redirectTo({
            url: "../index/index"
          });
        })
        .catch((e) => {
          uni.showToast({
            icon: "none",
            title: "注册失败"
          });
        })
        .finally(() => {
          this.loading = false;
        });
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
.register-tip {
  font-size: 15px;
  text-align: right;
  margin-top: 20rpx;
}
</style>
