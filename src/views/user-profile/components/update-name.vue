<template>
  <div class="update-name">
    <!-- 导航栏 -->
    <van-nav-bar
      title="修改昵称"
      left-text="取消"
      right-text="完成"
      @click-left="$emit('close')"
      @click-right="onConfirm"
    />

    <!-- 输入框 -->
    <div class="name-field-wrap">
      <van-field
        v-model="localName"
        rows="2"
        autosize
        type="textarea"
        maxlength="7"
        placeholder="请输入昵称"
        show-word-limit
      />
    </div>
  </div>
</template>

<script>
import { updteUserProfile } from "@/api/user";

export default {
  name: "updateName",
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      localName: this.value,
    };
  },
  methods: {
    async onConfirm() {
      this.$toast.loading({
        message: "保存中",
        forbidClick: true,
      });

      try {
        await updteUserProfile({
          name: this.localName,
        });

        this.$toast.success("保存成功");
        this.$emit("input", this.localName);
        this.$emit("close");
      } catch (err) {
        if (err && err.response && err.response.status === 409) {
          this.$toast.fail("昵称已存在");
        }
      }
    },
  },
  components: {},
};
</script>

<style scoped lang="less">
.name-field-wrap {
  padding: 10px;
}
</style>
