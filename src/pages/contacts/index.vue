<template>
  <view class="content">
    <view
      class="contact-item"
      v-for="item in contacts"
      @click="toChat(item)"
      :key="item"
    >
      <view class="avatar"> </view>
      <view>{{ item }}</view>
    </view>
  </view>
</template>
<script>
const conn = uni.conn;
export default {
  data() {
    return {
      contacts: []
    };
  },
  onLoad() {
    this.getContacts();
  },
  methods: {
    getContacts() {
      uni.conn.getContacts().then((res) => {
        this.contacts = res.data;
        console.log(res);
      });
    },
    toChat(uid) {
      uni.navigateTo({
        url: `../chat/index?to=${uid}`
      });
    }
  }
};
</script>

<style>
.content {
  padding: 30rpx;
}

.avatar {
  width: 100rpx;
  height: 100rpx;
  background: #ccc;
  margin-right: 20rpx;
  border-radius: 50%;
  background: url("../../static/logo.png");
  background-size: 100%;
}

.contact-item {
  display: flex;
  padding: 20rpx;
  margin: 20rpx;
  align-items: center;
  background: #f9f8f8;
  border-radius: 20rpx;
}

.tip {
  margin-bottom: 30rpx;
}
</style>
