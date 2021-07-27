<template>
  <div class="user-chat">
    <!-- NavBar导航栏部分start -->
    <van-nav-bar
      class="app-nav-bar"
      title="小智同学"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- NavBar导航栏部分end -->

    <!-- 消息列表 start -->
    <van-cell-group class="message-list" ref="messageList">
      <van-cell
        :title="item.msg"
        v-for="(item, index) in messages"
        :key="index"
      />
    </van-cell-group>
    <!-- 消息列表 end -->

    <!-- 发送消息 start -->
    <van-cell-group class="send-message-wrap">
      <van-field
        class="add-message"
        v-model="message"
        placeholder="请输入消息"
        :border="false"
      />
      <van-button
        class="send-message"
        type="primary"
        size="mini"
        @click="onSend"
        >发送</van-button
      >
    </van-cell-group>
    <!-- 发送消息 end -->
  </div>
</template>

<script>
import io from "socket.io-client";
import { setItem, getItem } from "@/utils/storage";

export default {
  name: "userChatIndex",
  props: {},
  data() {
    return {
      message: "",
      socket: null,
      messages: getItem("chat-messages") || [],
    };
  },
  watch: {
    messages() {
      setItem("chat-messages", this.messages);

      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },
  },
  created() {
    const socket = io({
      url: "http://ttapi.research.itcast.cn",
      query: {
        token:
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2MjczODE3OTMsInVzZXJfaWQiOjEsInJlZnJlc2giOmZhbHNlfQ._hNKW1iQKYhTtWHSXxsgpDCVmbRz6lVjX9nYLeFutQc",
      },
    });
    this.socket = socket;
    socket.on("connect", () => {
      console.log("连接建立成功");
    });
    socket.on("disconnect", () => {
      console.log("链接断开了");
    });
    // 监听 message 事件，接受服务端消息
    socket.on("message", (data) => {
      this.messages.push(data);
    });
  },
  mounted() {
    this.scrollToBottom();
  },
  methods: {
    onSend() {
      // 请求发送消息
      const data = {
        msg: this.message,
        timestamp: Date.now(),
      };
      this.socket.emit("message", data);

      // 把用户发出去的消息存储到数组中
      this.messages.push(data);
      this.message = "";
    },
    scrollToBottom() {
      const list = this.$refs["messageList"];
      list.scrollTop = list.scrollHeight;
    },
  },
  components: {},
};
</script>

<style scoped lang="less">
.message-list {
  position: fixed;
  left: 0;
  right: 0;
  top: 46px;
  bottom: 44px;
  overflow-y: auto;
}
.send-message-wrap {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  padding: 0 10px;
  align-items: center;
  .add-message {
    flex: 9;
  }
  .send-message {
    flex: 1;
  }
}
</style>
