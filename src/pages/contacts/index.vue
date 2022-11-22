<template>
  <view class="content">
    <view class="tip">Tips: 请选择你的联系人进入聊天</view>
    <view
      class="contact-item"
      v-for="item in contacts"
      @click="toChat(item)"
      :key="item"
      >{{ item }}
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

.contact-item {
  color: #fff;
  padding: 20rpx;
  background: #aaa;
  background: #4faeea;
  border-radius: 20rpx;
  margin: 20rpx;
}

.tip {
  margin-bottom: 30rpx;
}
</style>
