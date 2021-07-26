<template>
  <div class="post-comment">
    <van-field
      class="post-text"
      v-model.trim="message"
      rows="3"
      autosize
      type="textarea"
      maxlength="50"
      placeholder="请输入留言"
      show-word-limit
    />
    <van-button
      class="post-button"
      round
      size="mini"
      @click="onPost"
      :disabled="!message"
      >发布</van-button
    >
  </div>
</template>

<script>
import { addComment } from "@/api/comment";

export default {
  props: {
    target: {
      type: [Number, String, Object],
      required: true,
    },
    articleId: {
      type: [Number, String, Object],
      default: null,
    },
  },
  data() {
    return {
      message: "", //输入框内容
    };
  },
  methods: {
    async onPost() {
      this.$toast.loading({
        message: "发布中...",
        forbidClick: true,
      });

      const { data } = await addComment({
        target: this.target.toString(),
        content: this.message,
        art_id: this.articleId ? this.articleId.toString() : null,
      });
      this.$emit("post-success", data.data.new_obj);

      this.$toast.success("发布成功");

      this.message = "";
    },
  },
  components: {},
};
</script>

<style scoped lang="less">
.post-comment {
  padding: 14px;
  display: flex;
  align-items: center;
  .post-text {
    flex: 7;
  }
  .post-button {
    flex: 1;
    background-color: #e0e0e0;
  }
}
</style>
